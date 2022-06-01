import React from "react";
import { useAppContext } from "../context/AppContext";

type Props = {
  title?: string;
  workflow: any;
  setWorkflow: (a: any) => void;
};

const ConnectorsSelector = (props: Props) => {
  const { connectors } = useAppContext();
  const { title, workflow, setWorkflow } = props;
  const connectorsWithTriggers = connectors?.filter(
    (connector) =>
      connector && connector.triggers && connector.triggers.length > 0
  );
  const connectorsWithActions = connectors?.filter(
    (connector) =>
      connector && connector.actions && connector.actions.length > 0
  );

  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );
  const actionIsSet = Boolean(
    workflow && workflow.action && workflow.action.connector
  );

  const selectedTriggerConnector = connectorsWithTriggers?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow.trigger.connector
  );

  const selectedActionConnector = connectorsWithActions?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow.action.connector
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

  return (
    <div
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 100px",
        border: "1px solid #DCDCDC",
        borderRadius: 10,
      }}
    >
      {title && <h2 style={{ textAlign: "center" }}>{title}</h2>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "nowrap",
          gap: "88px",
        }}
      >
        <div>
          <label>
            <span style={{ display: "block" }}>Connect this...</span>
            <select
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
        <div>
          <label>
            <span style={{ display: "block" }}>With that...</span>
            <select
              value={
                (workflow &&
                  workflow.action &&
                  workflow.action &&
                  workflow.action.connector) ||
                ""
              }
              onChange={(e) => {
                setWorkflow({
                  ...workflow,
                  action: {
                    ...workflow.action,
                    connector: e.target.value,
                    operation: "",
                  },
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
          <div>
            <label>
              <span style={{ display: "block" }}>When this happens...</span>
              <select
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
                  }) => (
                    <option key={trigger.key} value={trigger.name}>
                      {trigger.display.label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
          <div>
            <label>
              <span style={{ display: "block" }}>Then do this...</span>
              <select
                value={
                  (workflow &&
                    workflow.action &&
                    workflow.action &&
                    workflow.action.operation) ||
                  ""
                }
                onChange={(e) => {
                  setWorkflow({
                    ...workflow,
                    action: {
                      ...workflow.action,
                      operation: e.target.value,
                    },
                  });
                }}
              >
                <option value="">Select an Action</option>
                {availableActions?.map(
                  (action: {
                    key: any;
                    name: any;
                    display: { label: any };
                  }) => (
                    <option key={action.key} value={action.name}>
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
  );
};

export default ConnectorsSelector;
