import React from "react";
import axios from "axios";
import { Text, Button } from "grindery-ui";
import _ from "lodash";
import { useAppContext } from "../context/AppContext";
import { Field } from "../types/Connector";
import ActionInputField from "./ActionInputField";

type Props = {
  index: number;
  step: number;
};

const ActionConfiguration = (props: Props) => {
  const { index, step } = props;
  const {
    workflow,
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    triggerConnector,
  } = useAppContext();

  const inputFields =
    action &&
    action.operation &&
    action.operation.inputFields &&
    action.operation.inputFields.filter(
      (inputField: { computed: any }) => inputField && !inputField.computed
    );

  /*const outputOptions = _.flatten(
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
  );*/

  const outputOptions = _.flatten(
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
  );

  const handleTestClick = () => {
    const readyWorkflow = {
      ...workflow,
      signature: JSON.stringify(workflow),
    };
    console.log("readyWorkflow", readyWorkflow);

    const urlParams = new URLSearchParams(window.location.search);
    const testEngine = urlParams.get("testEngine");
    if (testEngine && testEngine === "1") {
      axios
        .post("https://gnexus-orchestrator.herokuapp.com/", {
          jsonrpc: "2.0",
          method: "or_createWorkflow",
          id: new Date(),
          params: {
            userAccountId: readyWorkflow.creator,
            workflow: readyWorkflow,
          },
        })
        .then((res) => {
          console.log("or_createWorkflow res", res);
        })
        .catch((err) => {
          console.log("or_createWorkflow error", err);
        });
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
      <div>
        {inputFields.map((inputField: Field) => (
          <ActionInputField
            key={inputField.key}
            inputField={inputField}
            outputOptions={outputOptions}
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
