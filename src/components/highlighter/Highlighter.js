import React from "react";
import "./Highlighter.css";

const templatizeText = (fullText, searchText) => {
  function replacer(match) {
    return `{{${match}}}`;
  }
  return fullText.replace(new RegExp(`${searchText}`, "gi"), replacer);
};

export const Highlighter = ({ text, wordsList }) => {
  let replacedText = text;
  wordsList.forEach((highlightText) => {
    replacedText = templatizeText(replacedText, highlightText);
  });

  replacedText = replacedText
    .replace(new RegExp(`{{`, "gi"), `<span class="highlight">`)
    .replace(new RegExp(`}}`, "gi"), `</span>`);
  return <div dangerouslySetInnerHTML={{ __html: replacedText }}></div>;
};
