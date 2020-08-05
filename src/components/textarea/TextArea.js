import React from "react";
export const TextArea = ({ textList = [], onChange }) => {
  return (
    <textarea
      onChange={(evt) => onChange(evt.target.value)}
      style={{ width: "100%", height: "300px" }}
      defaultValue={textList.join("\n")}
    />
  );
};
