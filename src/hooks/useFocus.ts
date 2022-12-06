import { useRef } from "react";

export const useFocus = (): [React.MutableRefObject<any>, () => void] => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};
