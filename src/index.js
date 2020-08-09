import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { store } from "./store";
import { ASRContext } from "./api/asr/useASR";
import { ASRClient } from "./api/asr/ASRClient";

const asrClient = new ASRClient("wss://vibe-rc.i2x.ai");

ReactDOM.render(
  <ASRContext.Provider value={asrClient}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </ASRContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
