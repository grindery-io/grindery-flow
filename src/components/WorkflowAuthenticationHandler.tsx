import React, { useEffect } from "react";
import Logo from "./Logo";

type Props = {};

const WorkflowAuthenticationHandler = (props: Props) => {
  useEffect(() => {
    if (window && window.opener) {
      window.opener.postMessage(
        { g_url: window.location.href },
        window.location.origin
      );
      setTimeout(() => {
        window.close();
      }, 1000);
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
