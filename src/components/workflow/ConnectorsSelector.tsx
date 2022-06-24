import React from "react";
import styled from "styled-components";
import { Text, SelectInput, AutoCompleteInput, Button } from "grindery-ui";
import useWorkflowContext from "../../hooks/useWorkflowContext";

const InputWrapper = styled.div`
  & .paid-label {
    margin-left: auto;
  }
`;

type Props = {
  step: number;
  index: number; // action index
};

const ConnectorsSelector = (props: Props) => {
  const { step, index } = props;
  const {
    workflow,
    activeStep,
    updateWorkflow,
    setActiveStep,
    triggers,
    actions,
  } = useWorkflowContext();

  const triggerConnectorOptions = triggers.connectorsWithTriggers.map(
    (connector) => ({
      value: connector.key,
      label: connector.name,
      icon: connector.icon,
      paid: connector.pricing,
    })
  );

  const triggerConnectorValue = workflow.trigger.connector || "";

  const actionConnectorOptions = actions.connectorsWithActions.map(
    (connector) => ({
      value: connector.key,
      label: connector.name,
      icon: connector.icon,
      paid: connector.pricing,
    })
  );

  const actionConnectorValue = workflow.actions[index].connector || "";

  const triggerOptions = triggers.availableTriggers.map((availableTrigger) => ({
    value: availableTrigger.key,
    label: availableTrigger.display?.label,
    icon:
      availableTrigger.display?.icon || triggers.triggerConnector?.icon || "",
    description: availableTrigger.display?.description,
  }));

  const triggerValue = workflow.trigger.operation || "";

  const actionOptions = actions
    .availableActions(index)
    ?.map((availableAction) => ({
      value: availableAction.key,
      label: availableAction.display?.label,
      icon:
        availableAction.display?.icon ||
        actions.actionConnector(index)?.icon ||
        "",
      description: availableAction.display?.description,
    }));

  const actionValue = workflow.actions[index].operation || "";

  const handleTriggerConnectorChange = (value: string) => {
    updateWorkflow({
      "trigger.connector": value || "",
      "trigger.input": {},
      "trigger.operation": "",
      "trigger.credentials": undefined,
    });
  };

  const handleActionConnectorChange = (value: string) => {
    updateWorkflow({
      ["actions[" + index + "].connector"]: value || "",
      ["actions[" + index + "].input"]: {},
      ["actions[" + index + "].operation"]: "",
      ["actions[" + index + "].credentials"]: undefined,
    });
  };

  const handleTriggerChange = (value: string) => {
    updateWorkflow({
      "trigger.operation": value || "",
      "trigger.input": {},
    });
  };

  const handleActionChange = (value: string) => {
    updateWorkflow({
      ["actions[" + index + "].operation"]: value || "",
      ["actions[" + index + "].input"]: {},
    });
  };

  const handleContinueClick = () => {
    setActiveStep(2);
  };

  if (!activeStep || step < activeStep) {
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Text variant="h3" value="Connect (d)Apps"></Text>
      </div>
      <div style={{ marginTop: 40 }}>
        <InputWrapper>
          <AutoCompleteInput
            label="This..."
            size="full"
            placeholder="Select a Trigger"
            onChange={handleTriggerConnectorChange}
            options={triggerConnectorOptions}
            value={triggerConnectorValue}
          />
        </InputWrapper>
      </div>
      <div style={{ marginTop: 10 }}>
        <InputWrapper>
          <AutoCompleteInput
            label="With..."
            size="full"
            placeholder="Search for protocol"
            onChange={handleActionConnectorChange}
            options={actionConnectorOptions}
            value={actionConnectorValue}
          />
        </InputWrapper>
      </div>

      {triggers.triggerConnectorIsSet && actions.actionConnectorIsSet(index) && (
        <div>
          <div style={{ marginTop: 40 }}>
            <SelectInput
              label="When this happens..."
              type="default"
              placeholder="Select a Trigger"
              onChange={handleTriggerChange}
              options={triggerOptions}
              value={triggerValue}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <SelectInput
              label="Then do this..."
              type="default"
              placeholder="Select an Action"
              onChange={handleActionChange}
              options={actionOptions}
              value={actionValue}
            />
          </div>
        </div>
      )}
      {triggers.triggerIsSet && actions.actionIsSet(index) && (
        <div style={{ marginTop: 30 }}>
          <Button onClick={handleContinueClick} value="Continue" />
        </div>
      )}
    </div>
  );
};

export default ConnectorsSelector;
