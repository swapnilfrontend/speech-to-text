import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { SESSION_STARTED } from "../../store/consts";
import { PrimaryButton } from "../../components/button/PrimaryButton";
import { SESSION_DISCONNECTED, SESSION_ERRORED } from "../../store/consts";
import { useASR } from "../../api/asr/useASR";
import {
  setSessionStatus,
  setTranscripts,
  markTranscriptsStart
} from "../../store/actions";

export const SessionButton = () => {
  const ASRInstance = useASR();
  const dispatch = useDispatch();
  const sessionStatus = useSelector((state) => state.session);
  const phrases = useSelector((state) => state.phrases);

  const onSessionStart = (error, results) => {
    if (error) {
      dispatch(setSessionStatus(SESSION_ERRORED));
    } else {
      dispatch(setTranscripts(results));
    }
  };

  const startSession = () => {
    dispatch(setSessionStatus(SESSION_STARTED));
    dispatch(markTranscriptsStart());
    ASRInstance.start(phrases, onSessionStart);
  };

  const stopSession = () => {
    ASRInstance.stop();
    dispatch(setSessionStatus(SESSION_DISCONNECTED));
  };

  const toggleSession = () => {
    if (sessionStatus === SESSION_STARTED) {
      stopSession();
    } else {
      startSession();
    }
  };

  const buttonText =
    sessionStatus === SESSION_STARTED ? "Stop Session" : "Start Session";
  return (
    <PrimaryButton onClick={toggleSession} data-testid="manage-session-button">
      {buttonText}
    </PrimaryButton>
  );
};
