import React, { useState } from "react";

type Props = {
  setTriggerIsConfigured: (a: any) => void;
};

const TriggerConfiguration = (props: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <div
      style={{
        maxWidth: 1240,
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
            maxWidth: 470,
          }}
          onClick={() => {
            setAuthenticated(true);
          }}
        >
          Sign in to Google Sheets
        </button>
      )}
      {authenticated && (
        <div
          style={{
            width: "100%",
            maxWidth: 470,
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
          maxWidth: 470,
        }}
        disabled={!authenticated}
        onClick={() => {
          props.setTriggerIsConfigured(true);
        }}
      >
        {!authenticated && <>To continue, finish required fields</>}
        {authenticated && <>Continue</>}
      </button>
    </div>
  );
};

export default TriggerConfiguration;
