import React from "react";
import { AlertField, Text, Button } from "grindery-ui";
import { useAppContext } from "../context/AppContext";
import { Field } from "../types/Connector";
import ActionInputField from "./ActionInputField";
import { getOutputOptions } from "../utils";

type Props = {
  index: number;
  step: number;
};

const ActionConfiguration = (props: Props) => {
  const { index, step } = props;
  const {
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    triggerConnector,
    testWorkflowAction,
  } = useAppContext();

  const inputFields =
    action &&
    action.operation &&
    action.operation.inputFields &&
    action.operation.inputFields.filter(
      (inputField: { computed: any }) => inputField && !inputField.computed
    );

  const options = getOutputOptions(trigger.operation, triggerConnector);

  /*_.flatten(
    trigger.operation.outputFields &&
      trigger.operation.outputFields.map((outputField: any) => {
        if (outputField.list) {
          return trigger.operation.sample[outputField.key].map(
            (sample: any, i: any) => ({
              value: `{{trigger.${outputField.key}[${i}]}}`,
              label: `${outputField.label || outputField.key}[${i}]`,
              reference: sample,
              icon: triggerConnector.icon || "",
            })
          );
        } else {
          return {
            value: `{{trigger.${outputField.key}}}`,
            label: outputField.label || outputField.key,
            reference: trigger.operation.sample[outputField.key],
            icon: triggerConnector.icon || "",
          };
        }
      })
  );*/

  const handleTestClick = async () => {
    if (testWorkflowAction) {
      testWorkflowAction(index);
    }
  };

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return (
    <div
      style={{
        padding: "20px 20px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginTop: 20 }}>
        {actionConnector.icon && (
          <div
            style={{
              display: "inline-block",
              padding: 8,
              background: "#FFFFFF",
              border: "1px solid #DCDCDC",
              borderRadius: 5,
              margin: "0px auto 10px",
            }}
          >
            <img
              src={actionConnector.icon}
              alt={`${actionConnector.name} icon`}
              style={{ display: "block", width: 24, height: 24 }}
            />
          </div>
        )}
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
      {action &&
        action.operation &&
        action.operation.type === "blockchain:call" && (
          <AlertField
            text={
              <div style={{ textAlign: "left" }}>
                This action will require you to pay gas. Make sure your account
                has funds. Current balance:{" "}
                <a
                  href="#balance"
                  style={{
                    fontWeight: "bold",
                    color: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  0.003 ETH
                </a>
              </div>
            }
            color="warning"
            icon={<img src="/images/exclamation.png" width={20} height={20} />}
          />
        )}
      <div>
        {inputFields.map((inputField: Field) => (
          <ActionInputField
            key={inputField.key}
            inputField={inputField}
            options={options}
            index={index}
          />
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
