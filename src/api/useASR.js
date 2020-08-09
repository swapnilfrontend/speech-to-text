import React, { useContext } from "react";
import { ASRClient } from "./asr/ASRClient";

export const asrClient = new ASRClient("wss://vibe-rc.i2x.ai");

export const ASRContext = React.createContext(null);

export const useASR = () => useContext(ASRContext);
