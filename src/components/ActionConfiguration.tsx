import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Props = {
  index: number;
  step: number;
};

const ActionConfiguration = (props: Props) => {
  const { index, step } = props;
  const {
    workflow,
    updateWorkflow,
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    setActiveStep,
  } = useAppContext();

  const [showResult, setShowResult] = useState(false);

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
    updateWorkflow?.({
      ["actions[" + index + "].input." + inputField.key]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowResult(true);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ textAlign: "left", margin: 0 }}>Set up Action</h2>
      </div>
    );
  }

  if (step > activeStep) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
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
                            (workflow?.actions[index].input[inputField.key] &&
                              workflow?.actions[index].input[
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
                            (workflow?.actions[index].input[inputField.key] &&
                              workflow?.actions[index].input[
                                inputField.key
                              ].toString()) ||
                            ""
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
        {actionIsConfigured && (
          <button
            style={{
              display: "block",
              margin: "40px 0 0 0",
              padding: 10,
              textAlign: "center",
              width: "100%",
              maxWidth: "100%",
            }}
            type="submit"
          >
            Test it!
          </button>
        )}
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
          <pre style={{ overflow: "auto" }}>
            {JSON.stringify(workflow, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ActionConfiguration;
