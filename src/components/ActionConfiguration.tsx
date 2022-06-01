import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Props = {
  workflow: any;
  setWorkflow: (a: any) => void;
};

const ActionConfiguration = (props: Props) => {
  const { connectors } = useAppContext();
  const workflowActionConnector = props.workflow.action.connector;
  const workflowTriggerConnector = props.workflow.trigger.connector;
  const workflowActionOperation = props.workflow.action.operation;
  const workflowTriggerOperation = props.workflow.trigger.operation;
  const actionConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowActionConnector
  );
  const triggerConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowTriggerConnector
  );
  const action = actionConnector.actions.find(
    (connectorAction: { name: any }) =>
      connectorAction && connectorAction.name === workflowActionOperation
  );
  const trigger = triggerConnector.triggers.find(
    (connectorTrigger: { name: any }) =>
      connectorTrigger && connectorTrigger.name === workflowTriggerOperation
  );

  console.log("action", action);

  return (
    <div
      style={{
        maxWidth: 1028,
        margin: "54px auto 0",
        padding: "80px 100px",
        border: "1px solid #DCDCDC",
        borderRadius: 10,
      }}
    >
      <h2 style={{ textAlign: "center", margin: 0 }}>
        Map fields from {triggerConnector.name} into {actionConnector.name}
      </h2>
      {action &&
        action.operation &&
        action.operation.inputFields &&
        action.operation.inputFields.map(
          (inputField: {
            label: any;
            key: any;
            placeholder: any;
            type: any;
          }) => (
            <>
              {!!inputField && (
                <div
                  key={inputField.key}
                  style={{
                    width: "100%",
                    marginTop: 40,
                  }}
                >
                  <label>
                    <span style={{ display: "block" }}>{inputField.label}</span>
                    {inputField.type === "string" && (
                      <select
                        style={{
                          width: "100%",
                          padding: 10,
                        }}
                        value={
                          props.workflow.action.input[inputField.key] || ""
                        }
                        onChange={(e) => {
                          props.setWorkflow({
                            ...props.workflow,
                            action: {
                              ...props.workflow.action,
                              input: {
                                ...props.workflow.action.input,
                                [inputField.key]: e.target.value,
                              },
                            },
                          });
                        }}
                      >
                        <option value="">{inputField.placeholder || ""}</option>
                        {Object.keys(trigger.operation.sample).map(
                          (sampleKey) => {
                            if (
                              Array.isArray(trigger.operation.sample[sampleKey])
                            ) {
                              return trigger.operation.sample[sampleKey].map(
                                (v: any, i: any) => (
                                  <option key={v} value={v}>
                                    {sampleKey} {i}: {v}
                                  </option>
                                )
                              );
                            } else {
                              return (
                                <option
                                  key={trigger.operation.sample[sampleKey]}
                                  value={trigger.operation.sample[sampleKey]}
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
                          props.workflow.action.input[inputField.key] || ""
                        }
                        onChange={(e) => {
                          props.setWorkflow({
                            ...props.workflow,
                            action: {
                              ...props.workflow.action,
                              input: {
                                ...props.workflow.action.input,
                                [inputField.key]: e.target.value,
                              },
                            },
                          });
                        }}
                        placeholder={inputField.placeholder || ""}
                      />
                    )}
                  </label>
                </div>
              )}
            </>
          )
        )}
    </div>
  );
};

export default ActionConfiguration;
