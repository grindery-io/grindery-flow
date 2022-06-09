import React from "react";
import { Text, SelectInput, Button } from "grindery-ui";
import _ from "lodash";
import { useAppContext } from "../context/AppContext";
import { Field } from "../types/Connector";

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
    triggerConnector,
  } = useAppContext();

  const outputOptions = _.flatten(
    Object.keys(trigger.operation.sample).map((sampleKey) => {
      if (Array.isArray(trigger.operation.sample[sampleKey])) {
        return trigger.operation.sample[sampleKey].map((v: any, i: any) => ({
          value: `{{step${index}.${sampleKey}[${i}]}}`,
          label: `${sampleKey}[${i}]`,
          reference: v,
          icon: triggerConnector.icon || "",
        }));
      } else {
        return {
          value: `{{step${index}.${sampleKey}}}`,
          label: sampleKey,
          reference: trigger.operation.sample[sampleKey],
          icon: triggerConnector.icon || "",
        };
      }
    })
  );

  const handleFieldChange = (val: any, inputField: Field) => {
    const value = Array.isArray(val)
      ? val.map((v) => v.value).join(" ")
      : val.value;

    updateWorkflow?.({
      ["actions[" + index + "].input." + inputField.key]: value || "",
    });
  };

  const handleTestClick = () => {};

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
          value={`Set fields${
            action && action.display && action.display.label
              ? " for " + action.display.label
              : ""
          }`}
        />
      </div>
      <div>
        {action &&
          action.operation &&
          action.operation.inputFields &&
          action.operation.inputFields.map((inputField: Field) => (
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
                    type="searchLabel"
                    variant="full"
                    placeholder={inputField.placeholder}
                    required={!!inputField.required}
                    texthelper={inputField.helpText || ""}
                    options={outputOptions}
                    onChange={(e: any) => {
                      handleFieldChange(e, inputField);
                    }}
                    value={
                      (workflow?.actions[index].input[inputField.key] &&
                        workflow?.actions[index].input[
                          inputField.key
                        ].toString()) ||
                      ""
                    }
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        {actionIsConfigured && (
          <div style={{ marginTop: 40 }}>
            <Button
              onClick={handleTestClick}
              value="Test & Continue"
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionConfiguration;
