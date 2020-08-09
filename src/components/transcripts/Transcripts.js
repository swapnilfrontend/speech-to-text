import React from "react";
import "./Transcripts.css";
import { Highlighter } from "../../components/highlighter/Highlighter";

const getTranscriptsMergedByTimestamp = (transcripts) => {
  const mergedResult = [];

  transcripts.forEach((transcriptResult, idx) => {
    if (idx === 0) {
      mergedResult.push([transcriptResult]);
      return;
    }
    const { transcript: current } = transcriptResult;
    const { transcript: previous } = transcripts[idx - 1];
    const offset = current.startOffsetMsec - previous.endOffsetMsec;
    if (mergedResult.length > 0 && offset <= 2000) {
      const lastItem = mergedResult[mergedResult.length - 1];
      lastItem.push(transcriptResult);
    } else {
      mergedResult.push([transcriptResult]);
    }
  });
  return mergedResult;
};

export const Transcripts = ({ transcripts = [] }) => {
  const mergedMessages = getTranscriptsMergedByTimestamp(transcripts);

  return mergedMessages.map((mergedMessage, idx) => {
    return (
      <div className="transcript-text" key={idx}>
        {mergedMessage.map(({ transcript, spotted }, idx) => {
          return (
            <div className="speech-bubble" key={idx}>
              <Highlighter
                text={transcript.utterance}
                wordsList={spotted}
                key={idx}
              />
            </div>
          );
        })}
      </div>
    );
  });
};
