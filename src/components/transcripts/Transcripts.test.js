import { render } from "@testing-library/react";
import React from "react";
import { data } from "../../mocks/data";
import { Transcripts } from "./Transcripts";

describe("<Transcripts/>", () => {
  it("merges the messages based on timestamp", () => {
    const { container } = render(<Transcripts transcripts={data} />);
    const transcriptTextElements = container.querySelectorAll(
      ".transcript-text"
    );
    // expect that we get 5 elements as 3 of them will be combined
    expect(Array.from(transcriptTextElements)).toHaveLength(5);
    const fourthElement = transcriptTextElements[3];
    const combinedUtterance = `${data[3].transcript.utterance}${data[4].transcript.utterance}${data[5].transcript.utterance}`;
    expect(fourthElement.textContent).toBe(combinedUtterance);
  });
});
