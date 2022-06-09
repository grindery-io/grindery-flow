import React, { useEffect } from "react";
import Logo from "./Logo";

type Props = {};

const WorkflowAuthenticationHandler = (props: Props) => {
  const receiveMessage = (e: { origin: any; data: any }) => {
    if (e.origin === window.location.origin) {
      const { data } = e;
      if (data.gr_close) {
        window.close();
      }
    }
  };

  useEffect(() => {
    if (window && window.opener) {
      window.opener.postMessage(
        { gr_url: window.location.href },
        window.location.origin
      );

      window.addEventListener(
        "message",
        (event) => receiveMessage(event),
        false
      );
    }
  }, []);

  return (
    <>
      <div style={{ padding: "50px 20px 50px", textAlign: "center" }}>
        <Logo />
      </div>
      <div style={{ padding: "0 20px 50px", textAlign: "center" }}>
        Authenticating...
      </div>
    </>
  );
};

export default WorkflowAuthenticationHandler;
