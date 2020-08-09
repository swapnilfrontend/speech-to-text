import { configureStore } from "@reduxjs/toolkit";
import { transcripts, phrases, session } from "./reducers";
import { SESSION_DISCONNECTED } from "./consts";
import { intitialPhrases } from "../mocks/data";

const reducer = {
  transcripts,
  phrases,
  session
};

const preloadedState = {
  transcripts: [],
  phrases: intitialPhrases,
  session: SESSION_DISCONNECTED
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState
});
