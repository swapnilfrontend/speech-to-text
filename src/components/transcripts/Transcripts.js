import React from "react";
import "./Transcripts.css";
import { Highlighter } from "../../components/highlighter/Highlighter";
import { deepEqual } from "../../lib/array";
import SpeechBubble from "../speechBubble/SpeechBubble";

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
    // if the difference between current and previous transcript offset is less than equal to 2 secs
    // we merge them into single array to display them in one speech bubble
    if (mergedResult.length > 0 && offset <= 2000) {
      const lastItem = mergedResult[mergedResult.length - 1];
      lastItem.push(transcriptResult);
    } else {
      mergedResult.push([transcriptResult]);
    }
  });
  return mergedResult;
};

export const Transcripts = React.memo(
  ({ transcripts = [] }) => {
    const mergedMessages = getTranscriptsMergedByTimestamp(transcripts);

    return mergedMessages.map((mergedMessage, idx) => {
      return (
        <div className="transcript-text" key={idx}>
          {mergedMessage.map(({ transcript, spotted }, idx) => {
            return (
              <SpeechBubble key={idx}>
                <Highlighter
                  text={transcript.utterance}
                  wordsList={spotted}
                  key={idx}
                />
              </SpeechBubble>
            );
          })}
        </div>
      );
    });
  },
  (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  }
);
