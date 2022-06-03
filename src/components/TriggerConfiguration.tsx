import React from "react";
import { useAppContext } from "../context/AppContext";

type Props = {};

const TriggerConfiguration = (props: Props) => {
  const {
    workflow,
    updateWorkflow,
    trigger,
    setTriggerConfigSubmitted,
    triggerAuthenticationFields,
    isTriggerAuthenticationRequired,
    triggerIsAuthenticated,
    triggerConnector,
  } = useAppContext();

  if (!workflow || !updateWorkflow) {
    return null;
  }

  const handleAuthClick = () => {
    if (triggerAuthenticationFields && triggerAuthenticationFields.length > 0) {
      const credentials: any = {};
      triggerAuthenticationFields.forEach((field) => {
        credentials[field] = "demo_token";
      });
      updateWorkflow({
        "trigger.credentials": credentials,
      });
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    inputField: {
      key: any;
    }
  ) => {
    if (setTriggerConfigSubmitted) {
      setTriggerConfigSubmitted(false);
    }
    updateWorkflow({
      ["trigger.input." + inputField.key]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (setTriggerConfigSubmitted) {
      setTriggerConfigSubmitted(true);
    }
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
      <h2 style={{ textAlign: "center", margin: 0 }}>
        Set up trigger for {triggerConnector.name}
      </h2>
      {isTriggerAuthenticationRequired && (
        <>
          {!triggerIsAuthenticated && (
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
          {triggerIsAuthenticated && (
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
        </>
      )}

      {triggerIsAuthenticated && (
        <form onSubmit={handleFormSubmit}>
          {trigger &&
            trigger.operation &&
            trigger.operation.inputFields &&
            trigger.operation.inputFields
              .filter(
                (inputField: { computed: any }) =>
                  inputField && !inputField.computed
              )
              .map(
                (inputField: {
                  label: any;
                  key: any;
                  placeholder: any;
                  type: any;
                  required: any;
                  choices?: any[];
                }) => (
                  <React.Fragment key={inputField.key}>
                    {!!inputField && (
                      <div
                        style={{
                          width: "100%",
                          marginTop: 40,
                        }}
                      >
                        <label>
                          <span style={{ display: "block" }}>
                            {inputField.label}
                          </span>
                          {inputField.choices &&
                          inputField.choices.length > 0 ? (
                            <select
                              style={{
                                width: "100%",
                                padding: 10,
                              }}
                              value={
                                (workflow?.trigger.input[inputField.key] &&
                                  workflow?.trigger.input[
                                    inputField.key
                                  ].toString()) ||
                                ""
                              }
                              onChange={(e) => {
                                handleFieldChange(e, inputField);
                              }}
                              required={!!inputField.required}
                            >
                              <option value="">
                                {inputField.placeholder || ""}
                              </option>
                              {inputField.choices.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                  {choice.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              name={inputField.key}
                              style={{
                                width: "100%",
                                padding: 10,
                              }}
                              type="text"
                              placeholder={inputField.placeholder || ""}
                              required={!!inputField.required}
                              value={
                                (workflow?.trigger.input[inputField.key] &&
                                  workflow?.trigger.input[
                                    inputField.key
                                  ].toString()) ||
                                ""
                              }
                              onChange={(e) => {
                                handleFieldChange(e, inputField);
                              }}
                            />
                          )}
                        </label>
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
          <button
            style={{
              display: "block",
              margin: "40px auto 0",
              padding: 10,
              textAlign: "center",
              width: "100%",
              maxWidth: 604,
            }}
            type="submit"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );
};

export default TriggerConfiguration;
