import React from "react";
import { useAppContext } from "../context/AppContext";

type Props = {
  title?: string;
};

const ConnectorsSelector = (props: Props) => {
  const {
    workflow,
    setWorkflow,
    connectorsWithActions,
    connectorsWithTriggers,
  } = useAppContext();
  const { title } = props;

  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );
  const actionIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].connector
  );

  const selectedTriggerConnector = connectorsWithTriggers?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow?.trigger.connector
  );

  const selectedActionConnector = connectorsWithActions?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow?.actions[0].connector
  );

  const availableTriggers =
    (triggerIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
    [];

  const availableActions =
    (triggerIsSet &&
      selectedActionConnector &&
      selectedActionConnector.actions) ||
    [];

  return workflow && !!setWorkflow ? (
    <div
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 100px",
        border: "1px solid #DCDCDC",
        borderRadius: 10,
      }}
    >
      {title && <h2 style={{ textAlign: "center", margin: 0 }}>{title}</h2>}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "nowrap",
          gap: "88px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 470,
          }}
        >
          <label>
            <span style={{ display: "block" }}>Connect this...</span>
            <select
              style={{
                width: "100%",
                maxWidth: 470,
                padding: 10,
              }}
              value={
                (workflow && workflow.trigger && workflow.trigger.connector) ||
                ""
              }
              onChange={(e) => {
                setWorkflow({
                  ...workflow,
                  trigger: {
                    ...workflow.trigger,
                    connector: e.target.value,
                    operation: "",
                    input: {},
                  },
                });
              }}
            >
              <option value="">Search for an App</option>
              {connectorsWithTriggers?.map((connector) => (
                <option key={connector.name} value={connector.name}>
                  {connector.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 470,
          }}
        >
          <label>
            <span style={{ display: "block" }}>With that...</span>
            <select
              style={{
                width: "100%",
                maxWidth: 470,
                padding: 10,
              }}
              value={
                (workflow &&
                  workflow.actions &&
                  workflow.actions &&
                  workflow.actions[0] &&
                  workflow.actions[0].connector) ||
                ""
              }
              onChange={(e) => {
                setWorkflow({
                  ...workflow,
                  actions: [
                    {
                      ...workflow.actions[0],
                      connector: e.target.value,
                      operation: "",
                      input: {},
                    },
                  ],
                });
              }}
            >
              <option value="">Search for protocol</option>
              {connectorsWithActions?.map((connector) => (
                <option key={connector.name} value={connector.name}>
                  {connector.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {triggerIsSet && actionIsSet && (
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: "88px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 470,
            }}
          >
            <label>
              <span style={{ display: "block" }}>When this happens...</span>
              <select
                style={{
                  width: "100%",
                  maxWidth: 470,
                  padding: 10,
                }}
                value={
                  (workflow &&
                    workflow.trigger &&
                    workflow.trigger.operation) ||
                  ""
                }
                onChange={(e) => {
                  setWorkflow({
                    ...workflow,
                    trigger: {
                      ...workflow.trigger,
                      operation: e.target.value,
                    },
                  });
                }}
              >
                <option value="">Select a Trigger</option>
                {availableTriggers.map(
                  (trigger: {
                    key: any;
                    name: any;
                    display: { label: any };
                    operation: any;
                  }) => (
                    <option
                      key={trigger.key}
                      value={trigger.name}
                      disabled={
                        !trigger ||
                        !trigger.operation ||
                        !trigger.operation.inputFields ||
                        trigger.operation.inputFields.length < 1
                      }
                    >
                      {trigger.display.label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: 470,
            }}
          >
            <label>
              <span style={{ display: "block" }}>Then do this...</span>
              <select
                style={{
                  padding: 10,
                  width: "100%",
                  maxWidth: 470,
                }}
                value={
                  (workflow &&
                    workflow.actions &&
                    workflow.actions[0] &&
                    workflow.actions[0].operation) ||
                  ""
                }
                onChange={(e) => {
                  setWorkflow({
                    ...workflow,
                    actions: [
                      {
                        ...workflow.actions[0],
                        operation: e.target.value,
                      },
                    ],
                  });
                }}
              >
                <option value="">Select an Action</option>
                {availableActions?.map(
                  (action: {
                    key: any;
                    name: any;
                    display: { label: any };
                    operation: any;
                  }) => (
                    <option
                      key={action.key}
                      value={action.name}
                      disabled={
                        !action ||
                        !action.operation ||
                        !action.operation.inputFields ||
                        action.operation.inputFields.length < 1
                      }
                    >
                      {action.display.label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ConnectorsSelector;
