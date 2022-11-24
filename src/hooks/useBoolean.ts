import {useMemo} from "react";
import {default as useToggle} from "react-use/lib/useToggle";

/**
 * Return array of [value, setTrue, setFalse], you can call setTrue and setFalse without setup useCallback
 */
const useBoolean = (initialValue: boolean = false): [boolean, () => void, () => void] => {
  const [value, toggle] = useToggle(initialValue);

  const {setTrue, setFalse} = useMemo(() => ({
    setTrue: () => toggle(true),
    setFalse: () => toggle(false)
  }), []);

  return [value, setTrue, setFalse];
};

export default useBoolean;
