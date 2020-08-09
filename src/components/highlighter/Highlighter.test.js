import React from "react";
import { render } from "@testing-library/react";
import { Highlighter } from "./Highlighter";

describe("<Highlighter/>", () => {
  it("highlights single presented text", () => {
    const textToHighlight = "My name is swapnil";
    const wordsToHighlight = ["name", "is"];
    const { getByText } = render(
      <Highlighter text={textToHighlight} wordsList={wordsToHighlight} />
    );
    expect(getByText("name").classList).toContain("highlight");
    expect(getByText("is").classList).toContain("highlight");
  });

  it("highlights multiple presented text", () => {
    const textToHighlight = "My name is swapnil and my hobby is cycling";
    const wordsToHighlight = ["name", "is"];
    const { getByText, getAllByText } = render(
      <Highlighter text={textToHighlight} wordsList={wordsToHighlight} />
    );
    expect(getByText("name").classList).toContain("highlight");
    const multipleText = getAllByText("is");
    expect(multipleText).toHaveLength(2);
    multipleText.forEach((el) => expect(el.classList).toContain("highlight"));
  });
});
