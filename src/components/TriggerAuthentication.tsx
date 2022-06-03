import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Props = {};

const TriggerAuthentication = (props: Props) => {
  const { workflow, setWorkflow, triggerAuthenticationField } = useAppContext();
  const [authenticated, setAuthenticated] = useState(false);

  if (!workflow || !setWorkflow) {
    return null;
  }

  const handleNextClick = () => {
    if (triggerAuthenticationField) {
      setWorkflow({
        ...workflow,
        trigger: {
          ...workflow.trigger,
          input: {
            ...workflow?.trigger.input,
          },
          authentication: {
            [triggerAuthenticationField]: "demo_token",
          },
        },
      });
    }
  };

  const handleAuthClick = () => {
    setAuthenticated(true);
  };

  return (
    <div
      style={{
        maxWidth: 816,
        margin: "54px auto 0",
        padding: "80px 100px",
        border: "1px solid #DCDCDC",
        borderRadius: 10,
      }}
    >
      <h2 style={{ textAlign: "center", margin: 0 }}>Connect your account</h2>
      {!authenticated && (
        <button
          style={{
            display: "block",
            margin: "40px auto 0",
            padding: 10,
            textAlign: "center",
            width: "100%",
            maxWidth: 604,
          }}
          onClick={handleAuthClick}
        >
          Sign in to Google Sheets
        </button>
      )}
      {authenticated && (
        <div
          style={{
            width: "100%",
            maxWidth: 604,
            margin: "40px auto 0",
            textAlign: "center",
          }}
        >
          <label style={{ textAlign: "left", display: "block" }}>
            Google Sheets account
          </label>
          <input
            style={{
              width: "100%",
              padding: "10px 20px",
              boxSizing: "border-box",
            }}
            type="text"
            value="Google Sheets email@example.com"
            readOnly
          />
        </div>
      )}
      <button
        style={{
          display: "block",
          margin: "20px auto 0",
          padding: 10,
          textAlign: "center",
          width: "100%",
          maxWidth: 604,
        }}
        disabled={!authenticated}
        onClick={handleNextClick}
      >
        {!authenticated && <>To continue, finish required fields</>}
        {authenticated && <>Continue</>}
      </button>
    </div>
  );
};

export default TriggerAuthentication;
