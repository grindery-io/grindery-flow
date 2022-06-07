import React, { useEffect } from "react";

type Props = {};

const AuthenticationHandler = (props: Props) => {
  useEffect(() => {
    window.opener.postMessage(
      { g_url: window.location.href },
      window.location.origin
    );
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div style={{ padding: 50, textAlign: "center" }}>Authenticating...</div>
  );
};

export default AuthenticationHandler;
