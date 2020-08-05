import React, { useState } from "react";
import "./App.css";
import { TextArea } from "./components/textarea/TextArea";
import { data } from "./mocks/data";
import { flatten } from "./lib/flatten";
import { Transcripts } from "./containers/transcripts/Transcripts";

const initialWords = ["hello", "how", "You", "span", "div"];

function App() {
  const [matchWords, setMatchWords] = useState(initialWords);
  return (
    <div className="App">
      <header className="App-header">Process transcripts</header>
      <main className="main">
        <div className="transcripts">
          <Transcripts transcripts={data} wordList={matchWords} />
        </div>
        <div className="match-words">
          <TextArea
            textList={matchWords}
            onChange={(words) => {
              const wordList = words.split("\n");
              setMatchWords(flatten(wordList));
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
