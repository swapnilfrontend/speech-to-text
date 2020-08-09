import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { TextArea } from "./TextArea";

describe("<TextArea/>", () => {
  it("renders text area with passed text", () => {
    const textList = ["Today", "is", "great"];
    const { getByTestId } = render(
      <TextArea textList={textList} data-testid="text-area-1" />
    );
    const textAreaEl = getByTestId("text-area-1");
    expect(textAreaEl).not.toBeNull();
    expect(textAreaEl.value).toBe(textList.join("\n"));
  });

  it("calls callback function when text changes", () => {
    const textList = ["Today", "is", "great"];
    const onTextChange = jest.fn();
    const { getByTestId } = render(
      <TextArea
        textList={textList}
        data-testid="text-area-1"
        onChange={onTextChange}
      />
    );
    const textAreaEl = getByTestId("text-area-1");
    fireEvent.change(textAreaEl, {
      target: { value: [...textList, "a new text"].join("\n") }
    });
    expect(onTextChange).toHaveBeenCalledWith(
      [...textList, "a new text"].join("\n")
    );
  });
});
