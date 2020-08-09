import { useEffect, useRef } from "react";
export const useScrollToBottom = (shouldAutoScroll = false) => {
  let ref = null;
  let autoScroll = useRef(shouldAutoScroll);
  useEffect(() => {
    if (autoScroll.current) {
      ref.scrollTo && ref.scrollTo(0, ref.scrollHeight);
    }
  });

  return [
    (elementRef) => {
      ref = elementRef;
    },
    (auto) => {
      console.log("Setting auto scrolling to", auto);
      autoScroll.current = auto;
    }
  ];
};
