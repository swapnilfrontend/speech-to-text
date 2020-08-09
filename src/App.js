import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useASR } from "./api/asr/useASR";
import "./App.css";
import { TextArea } from "./components/textarea/TextArea";
import { Transcripts } from "./components/transcripts/Transcripts";
import { useScrollToBottom } from "./hooks/useScrollToBottom";
import { compact } from "./lib/array";
import {
  markTranscriptsStart,
  setPhrases,
  setSessionStatus,
  setTranscripts
} from "./store/actions";
import {
  SESSION_DISCONNECTED,
  SESSION_ERRORED,
  SESSION_STARTED
} from "./store/consts";

function App() {
  const ASRInstance = useASR();
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

  const Phrases = () => {
    const dispatch = useDispatch();
    const ASRInstance = useASR();
    const phrases = useSelector((state) => state.phrases);

    return (
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
    );
  };

  const SessionButton = () => {
    return (
      <button onClick={toggleSession}>
        {sessionStatus === SESSION_STARTED ? "Stop session" : "Start Session"}
      </button>
    );
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
            <Phrases />
          </div>
          <div style={{ gridColumn: "auto / span 12" }}>
            <SessionButton />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
