import React, { useState } from "react";
import "./App.css";
import { TextArea } from "./components/textarea/TextArea";
import { data } from "./mocks/data";
import { compact, cloneDeep } from "./lib/array";
import { Transcripts } from "./containers/transcripts/Transcripts";
import { ASRClient } from "./api/asr/ASRClient";
import { useScrollToBottom } from "./hooks/useScrollToBottom";

const ASRInstance = new ASRClient("wss://vibe-rc.i2x.ai");

const initialWords = ["hello", "how", "You", "span", "div"];

function App() {
  const [matchWords, setMatchWords] = useState(initialWords);
  const [transcripts, setTranscripts] = useState([data]);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [ref, setAutoScroll] = useScrollToBottom();

  const onSessionStart = (error, results) => {
    if (!error) {
      setTranscripts((prevTranscripts) => {
        const newTranscriptions = cloneDeep(prevTranscripts);
        const last = newTranscriptions[newTranscriptions.length - 1];
        last.push(results);
        return newTranscriptions;
      });
    }
  };

  const startSession = () => {
    setSessionStarted(true);
    transcripts.push([]);
    ASRInstance.start(matchWords, onSessionStart);
  };

  const stopSession = () => {
    ASRInstance.stop();
    setSessionStarted(false);
  };

  const toggleSession = () => {
    if (sessionStarted) {
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <div className="App">
      <header className="App-header">Process transcripts</header>
      <h1>{sessionStarted ? "Session started" : "No session"}</h1>
      <main>
        <div className="main">
          <div className="transcripts" ref={ref}>
            {transcripts.map((sessionTranscript, idx) => (
              <Transcripts
                key={idx}
                transcripts={sessionTranscript}
                wordList={matchWords}
              />
            ))}
          </div>
          <div className="match-words">
            <TextArea
              textList={matchWords}
              onChange={(words) => {
                const wordList = words.split("\n");
                setMatchWords(compact(wordList));
              }}
            />
          </div>
          <div style={{ gridColumn: "auto / span 12" }}>
            <button onClick={toggleSession}>
              {sessionStarted ? "Stop session" : "Start Session"}
            </button>
            <span style={{ marginLeft: 20 }}>
              Auto scroll:{" "}
              <input
                type="checkbox"
                onChange={(evt) => setAutoScroll(evt.target.checked)}
              />
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
