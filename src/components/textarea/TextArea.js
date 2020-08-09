import React from "react";
import "./TextArea.css";
export const TextArea = ({ textList = [], onChange, ...restProp }) => {
  return (
    <textarea
      {...restProp}
      onChange={(evt) => onChange(evt.target.value)}
      className="text-area"
      defaultValue={textList.join("\n")}
    />
  );
};
