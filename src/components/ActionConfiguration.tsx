import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Props = {};

const ActionConfiguration = (props: Props) => {
  const {
    workflow,
    updateWorkflow,
    action,
    trigger,
    actionConnector,
    setTriggerConfigSubmitted,
  } = useAppContext();

  const [showResult, setShowResult] = useState(false);

  if (!workflow || !updateWorkflow) {
    return null;
  }

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    inputField: {
      label: any;
      key: any;
      placeholder: any;
      type: any;
    }
  ) => {
    updateWorkflow({
      ["actions[0].input." + inputField.key]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowResult(true);
  };

  const handleBackClick = () => {
    if (setTriggerConfigSubmitted) {
      setTriggerConfigSubmitted(false);
    }
    setShowResult(false);
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
        Set up Action for {actionConnector.name}
      </h2>

      <h3 style={{ textAlign: "center", margin: "40px 0 0" }}>
        Set fields{" "}
        {action && action.display && action.display.label && (
          <>for {action.display.label}</>
        )}
      </h3>
      <form onSubmit={handleFormSubmit}>
        {action &&
          action.operation &&
          action.operation.inputFields &&
          action.operation.inputFields.map(
            (inputField: {
              label: any;
              key: any;
              placeholder: any;
              type: any;
              required: any;
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
                      {inputField.type === "string" && (
                        <select
                          style={{
                            width: "100%",
                            padding: 10,
                          }}
                          value={
                            workflow?.actions[0].input[inputField.key] || ""
                          }
                          onChange={(e) => {
                            handleFieldChange(e, inputField);
                          }}
                          required={!!inputField.required}
                        >
                          <option value="">
                            {inputField.placeholder || ""}
                          </option>
                          {Object.keys(trigger.operation.sample).map(
                            (sampleKey) => {
                              if (
                                Array.isArray(
                                  trigger.operation.sample[sampleKey]
                                )
                              ) {
                                return trigger.operation.sample[sampleKey].map(
                                  (v: any, i: any) => (
                                    <option
                                      key={v}
                                      value={`{{${trigger.key}__${sampleKey}[${i}]}}`}
                                    >
                                      {sampleKey} {i}: {v}
                                    </option>
                                  )
                                );
                              } else {
                                return (
                                  <option
                                    key={trigger.operation.sample[sampleKey]}
                                    value={`{{${trigger.key}__${sampleKey}}}`}
                                  >
                                    {sampleKey}:{" "}
                                    {trigger.operation.sample[sampleKey]}
                                  </option>
                                );
                              }
                            }
                          )}
                        </select>
                      )}
                      {inputField.type === "text" && (
                        <textarea
                          style={{
                            width: "100%",
                            padding: 10,
                          }}
                          value={
                            workflow?.actions[0].input[inputField.key] || ""
                          }
                          onChange={(e) => {
                            handleFieldChange(e, inputField);
                          }}
                          placeholder={inputField.placeholder || ""}
                          required={!!inputField.required}
                        />
                      )}
                    </label>
                  </div>
                )}
              </React.Fragment>
            )
          )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "nowrap",
            flexDirection: "row",
          }}
        >
          <button
            style={{
              display: "block",
              margin: "40px auto 0 0",
              padding: 10,
              textAlign: "center",
              width: "100%",
              maxWidth: 150,
            }}
            onClick={handleBackClick}
          >
            Back
          </button>
          <button
            style={{
              display: "block",
              margin: "40px 0 0 auto",
              padding: 10,
              textAlign: "center",
              width: "100%",
              maxWidth: 150,
            }}
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
      {showResult && (
        <div
          style={{
            margin: "80px 0 0",
          }}
        >
          <h3 style={{ textAlign: "center", margin: "0 0 20px", padding: 0 }}>
            Workflow JSON
          </h3>
          <pre>{JSON.stringify(workflow, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ActionConfiguration;
