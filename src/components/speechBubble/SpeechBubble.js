import React from "react";
import "./SpeechBubble.css";

const SpeechBubble = ({ children, ...restProps }) => {
  return (
    <div className="speech-bubble" {...restProps}>
      {children}
    </div>
  );
};

export default SpeechBubble;
