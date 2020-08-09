import React from "react";
import "./App.css";
import { TextArea } from "./components/textarea/TextArea";
import { compact } from "./lib/array";
import { Transcripts } from "./containers/transcripts/Transcripts";
import { ASRClient } from "./api/asr/ASRClient";
import { useScrollToBottom } from "./hooks/useScrollToBottom";
import { useDispatch, useSelector } from "react-redux";
import {
  setSessionStatus,
  setPhrases,
  setTranscripts,
  markTranscriptsStart
} from "./store/actions";
import {
  SESSION_ERRORED,
  SESSION_DISCONNECTED,
  SESSION_STARTED
} from "./store/consts";

const ASRInstance = new ASRClient("wss://vibe-rc.i2x.ai");

function App() {
  const dispatch = useDispatch();
  const sessionStatus = useSelector((state) => state.session);
  const phrases = useSelector((state) => state.phrases);
  const transcripts = useSelector((state) => state.transcripts);

  const [ref] = useScrollToBottom(true);

  const onSessionStart = (error, results) => {
    if (error) {
      dispatch(setSessionStatus(SESSION_ERRORED));
    } else {
      dispatch(setTranscripts(results));
    }
  };

  const startSession = () => {
    dispatch(setSessionStatus(SESSION_STARTED));
    dispatch(markTranscriptsStart());
    ASRInstance.start(phrases, onSessionStart);
  };

  const stopSession = () => {
    ASRInstance.stop();
    dispatch(setSessionStatus(SESSION_DISCONNECTED));
  };

  const toggleSession = () => {
    if (sessionStatus === SESSION_STARTED) {
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <div className="App">
      <header className="App-header">Process transcripts</header>
      <h1>{`Session ${sessionStatus}`}</h1>
      <main>
        <div className="main">
          <div className="transcripts" ref={ref}>
            {transcripts.map((sessionTranscript, idx) => (
              <Transcripts key={idx} transcripts={sessionTranscript} />
            ))}
          </div>
          <div className="match-words">
            <TextArea
              textList={phrases}
              onChange={(words) => {
                const newPhrases = words.split("\n");
                dispatch(setPhrases(newPhrases));
                if (ASRInstance.isStarted()) {
                  ASRInstance.updateSpottingConfig(compact(newPhrases));
                }
              }}
            />
          </div>
          <div style={{ gridColumn: "auto / span 12" }}>
            <button onClick={toggleSession}>
              {sessionStatus === SESSION_STARTED
                ? "Stop session"
                : "Start Session"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
