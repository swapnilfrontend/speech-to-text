import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import { Flex } from "./components/flex/Flex";
import { StatusHeading } from "./components/statusHeadling/StatusHeading";
import { Transcripts } from "./containers/transcripts/Transcripts";
import { Phrases } from "./containers/phrases/Phrases";
import { SessionButton } from "./containers/sessionButton/SessionButton";

function App() {
  const sessionStatus = useSelector((state) => state.session);

  return (
    <div className="App">
      <header className="App-header">Process transcripts</header>
      <main>
        <div className="main">
          <StatusHeading statusText={sessionStatus} />
          <Flex>
            <div>
              <p>Transcript</p>
              <Transcripts />
            </div>
            <div className="match-words">
              <p>Spotting Phrases</p>
              <Phrases />
            </div>
          </Flex>
          <div className="session-button">
            <SessionButton />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
