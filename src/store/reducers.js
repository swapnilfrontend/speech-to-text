import { createReducer } from "@reduxjs/toolkit";
import {
  setPhrases,
  setTranscripts,
  setSessionStatus,
  markTranscriptsStart as markTranscriptsSessionStart
} from "./actions";
import { cloneDeep, compact } from "../lib/array";
import { SESSION_DISCONNECTED } from "./consts";

export const transcripts = createReducer([], {
  [setTranscripts]: (state, { payload }) => {
    const newTranscriptions = cloneDeep(state);
    const last = newTranscriptions[newTranscriptions.length - 1];
    last.push(payload);
    return newTranscriptions;
  },
  [markTranscriptsSessionStart]: (state) => {
    state.push([]);
    return state;
  }
});

export const phrases = createReducer([], {
  [setPhrases]: (state, { payload }) => {
    return compact(payload);
  }
});

export const session = createReducer(SESSION_DISCONNECTED, {
  [setSessionStatus]: (state, { payload }) => {
    return payload;
  }
});
