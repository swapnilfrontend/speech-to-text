import React from "react";
import "./Transcripts.css";
import { Highlighter } from "../../components/highlighter/Highlighter";

const getTranscriptsMergedByTimestamp = (transcripts) => {
  const mergedMessages = [];

  transcripts.forEach(({ transcript }, idx) => {
    if (idx === 0) {
      mergedMessages.push([transcript]);
      return;
    }
    const current = transcript;
    const { transcript: previous } = transcripts[idx - 1];
    const offset = current.startOffsetMsec - previous.endOffsetMsec;
    if (mergedMessages.length > 0 && offset <= 2000) {
      const lastItem = mergedMessages[mergedMessages.length - 1];
      lastItem.push(current);
    } else {
      mergedMessages.push([current]);
    }
  });
  return mergedMessages;
};

export const Transcripts = ({ transcripts = [], wordList }) => {
  const mergedMessages = getTranscriptsMergedByTimestamp(transcripts);

  return mergedMessages.map((mergedMessage, idx) => {
    return (
      <div className="transcript-text" key={idx}>
        {mergedMessage.map((transcript, idx) => {
          return (
            <Highlighter
              text={transcript.utterance}
              wordsList={wordList}
              key={idx}
            />
          );
        })}
      </div>
    );
  });
};
