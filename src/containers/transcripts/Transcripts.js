import React from "react";
import { useSelector } from "react-redux";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { Transcripts as TranscriptsComponent } from "../../components/transcripts/Transcripts";

export const Transcripts = () => {
  const transcripts = useSelector((state) => state.transcripts);
  const [ref] = useScrollToBottom(true);

  return (
    <div className="transcripts" ref={ref}>
      {transcripts.map((sessionTranscript, idx) => (
        <TranscriptsComponent key={idx} transcripts={sessionTranscript} />
      ))}
    </div>
  );
};
