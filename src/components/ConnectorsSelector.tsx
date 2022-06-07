import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Props = {
  step: number;
};

const ConnectorsSelector = (props: Props) => {
  const { step } = props;
  const {
    workflow,
    connectorsWithActions,
    connectorsWithTriggers,
    triggerConnectorIsSet,
    actionConnectorIsSet,
    availableTriggers,
    availableActions,
    activeStep,
    updateWorkflow,
    setActiveStep,
    triggerIsSet,
    actionIsSet,
  } = useAppContext();
  const [formFields, setFormFields] = useState({
    "trigger.operation": workflow?.trigger.operation || "",
    "actions[0].operation": workflow?.actions[0].operation || "",
  });

  const formFilled =
    Object.entries(formFields)
      .map((field) => (field && field[1]) || "")
      .filter((field) => field).length === Object.entries(formFields).length;

  const handleTriggerConnectorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormFields({
      ...formFields,
      "trigger.operation": "",
    });
    updateWorkflow?.({
      "trigger.connector": e.target.value,
      "trigger.input": {},
      "trigger.credentials": undefined,
    });
  };

  const handleActionConnectorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormFields({
      ...formFields,
      "actions[0].operation": "",
    });
    updateWorkflow?.({
      "actions[0].connector": e.target.value,
      "actions[0].input": {},
      "actions[0].credentials": undefined,
    });
  };

  const handleTriggerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormFields({
      ...formFields,
      "trigger.operation": e.target.value,
    });
    updateWorkflow?.({
      "trigger.input": {},
    });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormFields({
      ...formFields,
      "actions[0].operation": e.target.value,
    });
    updateWorkflow?.({
      "actions[0].input": {},
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkflow?.(formFields);
    setActiveStep?.(2);
  };

  const handleTabClick = () => {
    setActiveStep?.(1);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return (
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #DCDCDC",
          cursor: "pointer",
        }}
        onClick={handleTabClick}
      >
        <h2 style={{ textAlign: "left", margin: 0 }}>Connect Apps</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", margin: 0 }}>Connect Apps</h2>
      <div style={{ marginTop: 40 }}>
        <label>
          <span style={{ display: "block" }}>This...</span>
          <select
            style={{
              width: "100%",
              maxWidth: 470,
              padding: 10,
            }}
            value={
              (workflow && workflow.trigger && workflow.trigger.connector) || ""
            }
            onChange={handleTriggerConnectorChange}
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
          marginTop: 10,
        }}
      >
        <label>
          <span style={{ display: "block" }}>With...</span>
          <select
            style={{
              width: "100%",
              maxWidth: 470,
              padding: 10,
            }}
            value={
              (workflow &&
                workflow.actions &&
                workflow.actions[0] &&
                workflow.actions[0].connector) ||
              ""
            }
            onChange={handleActionConnectorChange}
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

      {triggerConnectorIsSet && actionConnectorIsSet && (
        <div>
          <div
            style={{
              marginTop: 40,
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
                value={(formFields && formFields["trigger.operation"]) || ""}
                onChange={handleTriggerChange}
                required
              >
                <option value="">Select a Trigger</option>
                {availableTriggers?.map(
                  (trigger: {
                    key: any;
                    name: any;
                    display: { label: any };
                    operation: any;
                  }) => (
                    <option
                      key={trigger.key}
                      value={trigger.key}
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
              marginTop: 10,
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
                value={(formFields && formFields["actions[0].operation"]) || ""}
                onChange={handleActionChange}
                required
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
                      value={action.key}
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
      {formFilled && (
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
      )}
    </form>
  );
};

export default ConnectorsSelector;
