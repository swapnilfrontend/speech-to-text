import {
    isFunction,
    flatten,
    last,
    head,
    filter,
    map
} from 'lodash';
import * as protobuf from 'protobufjs';
import vibeProto from './vibe-schema.proto';

const ERROR_CODES = {
    SocketError: 1001,
    NavigatorError: 2002,
    ProtobufNotLoaded: 3003,
    NotConnectedError: 4004
};

class ASRError {
    constructor(code, originalError, data) {
        const codes = Object.keys(ERROR_CODES).map(key => ERROR_CODES[key]);
        if (!codes.includes(code)) {
            throw new Error('Invalid error code!');
        }
        this.originalError = originalError;
        this.code = code;
        this.data = data;
    }
}

class ASRClient {
    constructor(asrEndpoint, onLoadError) {
        if (!asrEndpoint) {
            throw new Error('Endpoint is required!');
        }
        this.onConnect = null;
        this.onClose = null;
        this._proto = null;
        this._asrEndpoint = asrEndpoint;
        this._started = false;
        this._bufferSize = 4096;
        this._socket = null;
        this._callback = null;
        this._sessionConfig = null;
        this._activeStream = null;
        this._scriptProcessor = null;
        this._audioInput = null;
        this._initialSpottingConfig = null;
        this._onLoadError = onLoadError;
        this._defaultConfig = {
            lingwareTopic: "general",
            languageCode: "en",
            anonymizationEnabled: false
        };
        this._loadProto();
    }

    isStarted() {
        return this._started;
    }

    isConnected() {
        return this._socket && this._socket.readyState === 1;
    }

    start(spottingPhrases, callback) {
        const config = {
            ...this._defaultConfig,
        };

        if (this._started) {
            throw new Error('Already started!');
        }

        if (!callback || !isFunction(callback)) {
            throw new Error('Please specify a callback for the results!');
        }

        const {
            languageCode,
            lingwareTopic,
            anonymizationEnabled
        } = config;

        this._initialSpottingConfig = spottingPhrases;
        this._audioContext = this._getAudioContext();
        this._started = true;
        this._callback = callback;
        this._sessionConfig = this._getSessionConfig(
            languageCode,
            lingwareTopic,
            this._audioContext.sampleRate,
            anonymizationEnabled
        );

        navigator.mediaDevices
                 .getUserMedia({ audio: true })
                 .then(this._handleStream.bind(this))
                 .catch(this._handleNavigatorError.bind(this));
    }

    stop() {
        if (!this._started) {
            throw new Error('Already stopped!');
        }
        this._reset();
    }

    /* getUserMedia events */

    // https://webaudiodemos.appspot.com/AudioRecorder/js/recorderjs/recorderWorker.js
    _getChunkBuffer(buffer) {
        const chunk = new ArrayBuffer(buffer.length * 2);

        let offset = 0;
        const output = new DataView(chunk);

        for (let i = 0; i < buffer.length; i += 1, offset += 2) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }

        return new Uint8Array(chunk);
    }

    // https://stackoverflow.com/questions/36525264/convert-sample-rate-in-web-audio-api
    // https://stackoverflow.com/questions/27598270/resample-audio-buffer-from-44100-to-16000
    _processMicrophone(event) {
        if (!this.isConnected()) {
            return;
        }
        // mono
        const originalBuffer = event.inputBuffer.getChannelData(0);
        const chunkBuffer = this._getChunkBuffer(originalBuffer);

        const chunkObject = {
            streamingRequest: {
                audioChunk: chunkBuffer
            }
        };
        const error = this._proto.RecognizeRequest.verify(chunkObject);

        if (error) {
            return console.error(error);
        }
        const request = this._proto.RecognizeRequest.create(chunkObject);
        this._socket.send(this._proto.RecognizeRequest.encode(request).finish());
    }

    _handleStream(stream) {
        this._activeStream = stream;
        this._audioInput = this._audioContext.createMediaStreamSource(stream);
        this._scriptProcessor = this._audioContext.createScriptProcessor(
            this._bufferSize,
            1,
            1
        );
        this._scriptProcessor.onaudioprocess = this._processMicrophone.bind(this);

        this._audioInput.connect(this._scriptProcessor);
        this._scriptProcessor.connect(this._audioContext.destination);

        this._socket = new WebSocket(this._asrEndpoint);
        this._socket.binaryType = 'arraybuffer';
        this._socket.onopen = this._handleOpen.bind(this);
        this._socket.onclose = this._handleClose.bind(this);
        this._socket.onmessage = this._handleMessage.bind(this);
    }

    _handleNavigatorError(error) {
        console.error(error);
        this._callback(new ASRError(ERROR_CODES.NavigatorError, error), null);
        this._reset();
    }

    _getAudioContext() {
        return new (window.AudioContext || window.webkitAudioContext)();
    }

    /* Socket Lifecycle */

    _send(obj) {
        if (!this._callback) {
            return;
        }

        if (!this.isConnected()) {
            return this._callback(new ASRError(ERROR_CODES.NotConnectedError));
        }

        if (!this._proto) {
            return this._callback(new ASRError(ERROR_CODES.ProtobufNotLoaded));
        }

        this._socket.send(this._proto.RecognizeRequest.encode(obj).finish());
    }

    updateSpottingConfig(spottingPhrases) {
        const config = [
            {
                tag: 'whitelist',
                phrases: map(spottingPhrases, word => ({ "text": word }))
            }
        ];

        if (!this._started) {
            throw new Error('Cannot update config while stopped!');
        }

        if (!config) {
            throw new Error('Spotting config is required!');
        }

        const request = {
            streamingRequest: {
                phraseSpottingConfig: {
                    entries: config
                }
            }
        };
        const validationError = this._proto.RecognizeRequest.verify(request);
        if (validationError) {
            return console.error(validationError);
        }
        this._send(this._proto.RecognizeRequest.create(request));
    }

    _handleMessage(event) {
        const msg = this._proto.RecognizeResponse.decode(new Uint8Array(event.data));
        if (msg.resultsMessage) {
            if (msg.resultsMessage.asrResult) {
                // console.log('[ASRClient] result: ', msg.resultsMessage.asrResult);
                const data = this._processTextResult(msg.resultsMessage.asrResult);

                if (data) {
                    this._callback(null, data);
                }
            }
        }
    }

    _processTextResult(result) {
        if (result.final && result.final.alternatives) {
            if (result.final.alternatives[0].normalizedTranscript.length > 0) {
                const phrases = filter(result.phraseSpottingResult, { tag: 'whitelist' });
                const spotted = map(phrases, 'phrase');
                const alternative = result.final.alternatives[0];
                const startOffsetMsec = head(alternative.words).startTimeMsec;
                const endOffsetMsec = last(alternative.words).endTimeMsec;

                const transcript = {
                    utterance: this._removeUNK(alternative.normalizedTranscript),
                    startOffsetMsec,
                    endOffsetMsec
                };

                return { transcript, spotted };
            }
        }

        return null;
    }

    _removeUNK(fromString) {
        return fromString.replace(/<UNK>/gi, '');
    }

    _handleOpen() {
        console.log('ASRClient Socket open!');
        if (this.onConnect) {
            this.onConnect();
        }
        const config = this._proto.RecognizeRequest.create(this._sessionConfig);
        this._send(config);
        this.updateSpottingConfig(this._initialSpottingConfig);
    }

    _handleClose(event) {
        console.log('ASRClient Socket closed: ', event);
        if (!event.wasClean) {
            const error = new Error(`Socket error: <${event.code}>`);
            this._callback(new ASRError(ERROR_CODES.SocketError, error));
        }
        this._reset();
        if (this.onClose) {
            this.onClose(event);
        }
    }

    /* ASRClient Lifecycle */

    _finalize() {
        if (this._socket.readyState === 1) {
            const request = {
                streamingRequest: {
                    finalizationToken: {}
                }
            };
            const validationError = this._proto.RecognizeRequest.verify(request);

            if (validationError) {
                return console.error(validationError);
            }
            this._send(this._proto.RecognizeRequest.create(request));
            this._socket.close();
        }
    }

    _reset() {
        this._sessionConfig = null;
        this._callback = null;
        this._initialSpottingConfig = null;
        this._scriptProcessor = null;
        this._audioInput = null;
        if (this._audioContext) {
            this._audioContext.close();
            this._audioContext = null;
        }
        if (this._socket) {
            this._finalize();
            this._socket = null;
        }
        if (this._activeStream) {
            this._activeStream.getAudioTracks()[0].stop();
            this._activeStream = null;
        }
        this._started = false;
    }

    _getSessionConfig(languageCode, lingwareTopic, sampleRate, anonymizationEnabled) {
        if (!this._proto) {
            throw new Error('Proto file not loaded!');
        }

        const config = {
            initialConfig: {
                encoding: this._proto.AudioEncoding.LINEAR16,
                sampleRateHertz: sampleRate,
                asrVendors: {
                    i2x: {
                        enabled: true,
                        lingwareTopic
                    }
                },
                maxAlternatives: 5,
                enableInterimResults: true,
                enablePhraseSpottingForInterimResults: true,
                enableInverseNormalization: true,
                enableAnonymization: anonymizationEnabled,
                languageCode
            }
        };

        const validationError = this._proto.RecognizeRequest.verify(config);
        if (validationError) {
            throw validationError;
        }
        return config;
    }

    _loadProto() {
        protobuf.load(vibeProto, (error, root) => {
            if (error) {
                return this._handleLoadError(error);
            }

            try {
                this._proto = {
                    RecognizeRequest: root.lookupType('vibe.RecognizeRequest'),
                    RecognizeResponse: root.lookupType('vibe.RecognizeResponse'),
                    AudioEncoding: root.lookupType('vibe.RecognitionConfig')
                        .AudioEncoding,
                    Vendor: root.lookupType('vibe.SpeechRecognitionResult').Vendor
                };
            } catch (err) {
                this._handleLoadError(err);
            }
        });
    }

    _handleLoadError(error) {
        console.error('Error while loading protobuf: ', error);
        if (this._onLoadError) {
            this._onLoadError(error);
        }
    }
}

const makeLanguageConfig = (lang = 'en') => {
    if (lang.includes('en')) {
        return {
            languageCode: 'en-US',
            lingwareTopic: 'general'
        };
    }
    return {
        languageCode: 'de-DE',
        lingwareTopic: 'general'
    };
};

const makePhrasesLists = (whitelist = []) => {
    const formatedWhitelist = {
        tag: 'whitelist',
        phrases: flatten(
            whitelist.map(phraseGroup => {
                return phraseGroup.alternatives.map(phrase => ({
                    text: phrase.text,
                    phraseProperties: {
                        phraseGroupName: phraseGroup.text,
                        points: 0
                    }
                }));
            })
        )
    };

    return [formatedWhitelist];
};

const getAsrConfig = url => {
    const urlObj = new URL(url);

    const lingwareTopic = urlObj.searchParams.get('topic') || null;
    const languageCode = urlObj.searchParams.get('lang') || null;
    const anonymization =
        urlObj.searchParams.get('anonymization') === 'true' ? true : false;

    return { lingwareTopic, languageCode, anonymization };
};

const VALID_TOPICS = ['homebell', 'vodafone', 'siemens'];

const validateTopic = lingwareTopic => {
    return VALID_TOPICS.includes(lingwareTopic);
};

export {
    ASRClient,
    ERROR_CODES,
    ASRError,
    makePhrasesLists,
    makeLanguageConfig,
    getAsrConfig,
    validateTopic
};
