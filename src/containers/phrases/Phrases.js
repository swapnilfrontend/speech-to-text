import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useASR } from "../../api/asr/useASR";
import { TextArea } from "../../components/textarea/TextArea";
import { compact } from "../../lib/array";
import { setPhrases } from "../../store/actions";

export const Phrases = () => {
  const dispatch = useDispatch();
  const ASRInstance = useASR();
  const phrases = useSelector((state) => state.phrases);

  return (
    <TextArea
      textList={phrases}
      onChange={(words) => {
        const newPhrases = words.split("\n");
        dispatch(setPhrases(newPhrases));
        if (ASRInstance.isStarted()) {
          ASRInstance.updateSpottingConfig(compact(newPhrases));
        }
      }}
    />
  );
};
