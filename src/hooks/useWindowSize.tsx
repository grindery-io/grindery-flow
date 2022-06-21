import { useLayoutEffect, useState } from "react";
import { SCREEN } from "../constants";

const useWindowSize = () => {
  const [size, setSize] = useState<string>("dekstop");
  useLayoutEffect(() => {
    function updateSize() {
      setSize(
        window.innerWidth < parseInt(SCREEN.DESKTOP.replace("px", ""))
          ? "phone"
          : "desktop"
      );
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export default useWindowSize;
