import { useRef } from "react";

function Component() {
  const abortControllerRef = useRef<AbortController>(new AbortController());

  const onAbortFetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Download aborted");

      // Reset new AbortController, so we can do re-fetch
      abortControllerRef.current = new AbortController();
    }
  };

  function getFile() {
    const signal = abortControllerRef.current.signal;

    fetch("http://localhost:3000/api/testing-http-lib", { signal })
      .then((response) => {
        console.log("Download complete", response);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("successfully aborted");
        } else {
          // handle error
        }
      });
  }

  return (
    <>
      <button onClick={getFile}>Get File</button>
      <br />
      <br />
      <button onClick={onAbortFetch}>Abort</button>
    </>
  );
}

export default Component;
