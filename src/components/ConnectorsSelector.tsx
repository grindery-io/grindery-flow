import React from "react";
import {
  Text,
  SelectInput,
  AutoCompleteInput,
  ButtonElement,
} from "grindery-ui";
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
    triggerConnector,
    actionConnector,
  } = useAppContext();

  const handleTriggerConnectorChange = (e: any, val: any) => {
    updateWorkflow?.({
      "trigger.connector": val?.value || "",
      "trigger.input": {},
      "trigger.operation": "",
      "trigger.credentials": undefined,
    });
  };

  const handleActionConnectorChange = (e: any, val: any) => {
    updateWorkflow?.({
      "actions[0].connector": val?.value || "",
      "actions[0].input": {},
      "actions[0].operation": "",
      "actions[0].credentials": undefined,
    });
  };

  const handleTriggerChange = (e: any) => {
    updateWorkflow?.({
      "trigger.operation": e.target.value?.value || "",
      "trigger.input": {},
    });
  };

  const handleActionChange = (e: any) => {
    updateWorkflow?.({
      "actions[0].operation": e.target.value?.value || "",
      "actions[0].input": {},
    });
  };

  const handleContinueClick = () => {
    setActiveStep?.(2);
  };

  const handleTabClick = () => {
    setActiveStep?.(1);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Text variant="h3" value="Connect Apps"></Text>
      </div>
      <div style={{ marginTop: 40 }}>
        <AutoCompleteInput
          label="This..."
          size="full"
          placeholder="Select a Trigger"
          onChange={handleTriggerConnectorChange}
          options={connectorsWithTriggers?.map((connector) => ({
            value: connector.name,
            label: connector.name,
            icon: connector.icon,
          }))}
          value={
            (workflow && workflow.trigger && workflow.trigger.connector) || ""
          }
        />
      </div>
      <div
        style={{
          marginTop: 10,
        }}
      >
        <AutoCompleteInput
          label="With..."
          size="full"
          placeholder="Search for protocol"
          onChange={handleActionConnectorChange}
          options={connectorsWithActions?.map((connector) => ({
            value: connector.name,
            label: connector.name,
            icon: connector.icon,
          }))}
          value={
            (workflow &&
              workflow.actions &&
              workflow.actions[0] &&
              workflow.actions[0].connector) ||
            ""
          }
        />
      </div>

      {triggerConnectorIsSet && actionConnectorIsSet && (
        <div>
          <div
            style={{
              marginTop: 40,
            }}
          >
            <SelectInput
              label="When this happens..."
              type="default"
              placeholder="Select a Trigger"
              onChange={handleTriggerChange}
              options={availableTriggers?.map((availableTrigger) => ({
                value: availableTrigger.key,
                label: availableTrigger.display?.label,
                icon:
                  availableTrigger.display?.icon ||
                  triggerConnector?.icon ||
                  "",
              }))}
              value={(workflow?.trigger && workflow?.trigger.operation) || ""}
            />
          </div>
          <div
            style={{
              marginTop: 10,
            }}
          >
            <SelectInput
              label="Then do this..."
              type="default"
              placeholder="Select an Action"
              onChange={handleActionChange}
              options={availableActions?.map((availableAction) => ({
                value: availableAction.key,
                label: availableAction.display?.label,
                icon:
                  availableAction.display?.icon || actionConnector?.icon || "",
              }))}
              value={
                (workflow?.actions[0] && workflow?.actions[0].operation) || ""
              }
            />
          </div>
        </div>
      )}
      {triggerIsSet && actionIsSet && (
        <div style={{ marginTop: 30 }}>
          <ButtonElement onClick={handleContinueClick} value="Continue" />
        </div>
      )}
    </div>
  );
};

export default ConnectorsSelector;
