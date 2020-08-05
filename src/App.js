import React, { useState } from "react";
import "./App.css";
import { TextArea } from "./components/textarea/TextArea";
import { data } from "./mocks/data";
import { compact, cloneDeep } from "./lib/array";
import { Transcripts } from "./containers/transcripts/Transcripts";
import { ASRClient } from "./api/asr/ASRClient";
import {} from "./lib/array";

const ASRInstance = new ASRClient("wss://vibe-rc.i2x.ai");

const initialWords = ["hello", "how", "You", "span", "div"];

function App() {
  const [matchWords, setMatchWords] = useState(initialWords);
  const [transcripts, setTranscripts] = useState([data]);
  const [sessionStarted, setSessionStarted] = useState(false);

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
          <div className="transcripts">
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
          <div>
            <button onClick={toggleSession}>
              {sessionStarted ? "Stop session" : "Start Session"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
