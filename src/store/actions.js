import { createAction } from "@reduxjs/toolkit";

export const setSessionStatus = createAction("session/status");
export const setPhrases = createAction("phrases/text");
export const setTranscripts = createAction("transcripts/results");
export const markTranscriptsStart = createAction("transcripts/markStart");
