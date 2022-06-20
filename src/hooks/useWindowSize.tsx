import { useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState<string>("dekstop");
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth < 1024 ? "phone" : "desktop");
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export default useWindowSize;
