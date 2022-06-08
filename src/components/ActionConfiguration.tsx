import React, { useState } from "react";
import { Text, SelectInput, ButtonElement } from "grindery-ui";
import _ from "lodash";
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
  } = useAppContext();

  const [showResult, setShowResult] = useState(false);

  const handleFieldChange = (
    e: any,
    inputField: {
      label: any;
      key: any;
      placeholder: any;
      type: any;
    }
  ) => {
    updateWorkflow?.({
      ["actions[" + index + "].input." + inputField.key]:
        e.target.value?.value || "",
    });
  };

  const handleTestClick = () => {
    //setShowResult(true);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return null;
  }

  if (step > activeStep) {
    return null;
  }

  return (
    <div
      style={{
        padding: "20px 20px 40px",
      }}
    >
      {actionConnector.icon && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: 8,
              background: "#FFFFFF",
              border: "1px solid #DCDCDC",
              borderRadius: 5,
              margin: "20px auto 10px",
            }}
          >
            <img
              src={actionConnector.icon}
              alt={`${actionConnector.name} icon`}
              style={{ display: "block", width: 24, height: 24 }}
            />
          </div>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <Text variant="h3" value="Set up Action" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${actionConnector.name}`} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
        <Text
          variant="h6"
          value={
            <>
              Set fields{" "}
              {action && action.display && action.display.label && (
                <>for {action.display.label}</>
              )}
            </>
          }
        />
      </div>
      <div>
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
                      marginTop: 20,
                    }}
                  >
                    <SelectInput
                      label={inputField.label}
                      type="search"
                      placeholder={inputField.placeholder}
                      onChange={(e: any) => {
                        handleFieldChange(e, inputField);
                      }}
                      multiple
                      options={_.flatten(
                        Object.keys(trigger.operation.sample).map(
                          (sampleKey) => {
                            if (
                              Array.isArray(trigger.operation.sample[sampleKey])
                            ) {
                              return trigger.operation.sample[sampleKey].map(
                                (v: any, i: any) => ({
                                  //value: `{{trigger.${sampleKey}[${i}]}}`,
                                  value: `${sampleKey} ${i}: ${v}`,
                                  label: `${sampleKey} ${i}: ${v}`,
                                  icon: actionConnector.icon || "",
                                })
                              );
                            } else {
                              return {
                                //value: `{{trigger.${sampleKey}}}`,
                                value: `${sampleKey} ${trigger.operation.sample[sampleKey]}`,
                                label: `${sampleKey}: ${trigger.operation.sample[sampleKey]}`,
                                icon: actionConnector.icon || "",
                              };
                            }
                          }
                        )
                      )}
                      value={
                        (workflow?.actions[index].input[inputField.key] &&
                          workflow?.actions[index].input[
                            inputField.key
                          ].toString()) ||
                        ""
                      }
                      required={!!inputField.required}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          )}
        {actionIsConfigured && (
          <div style={{ marginTop: 40 }}>
            <ButtonElement onClick={handleTestClick} value="Test it!" />
          </div>
        )}
      </div>
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
