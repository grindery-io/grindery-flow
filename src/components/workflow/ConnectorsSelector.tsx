import React from "react";
import styled from "styled-components";
import { Text, Select, Autocomplete } from "grindery-ui";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import {
  COMING_SOON_ACTIONS,
  COMING_SOON_TRIGGERS,
  ICONS,
  NOT_READY_ACTIONS,
  NOT_READY_TRIGGERS,
  SCREEN,
} from "../../constants";
import Button from "../shared/Button";
import useAppContext from "../../hooks/useAppContext";

const InputWrapper = styled.div`
  & .paid-label {
    margin-left: auto;
  }
`;

const AppsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;

  @media (min-width: ${SCREEN.TABLET}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & > div {
      width: calc(50% - 40px);
      margin-top: 40px !important;
    }
  }
`;

const TriggerActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;

  @media (min-width: ${SCREEN.TABLET}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & > div {
      width: calc(50% - 40px);
      margin-top: 40px !important;
    }
  }
`;

const JoinImage = styled.img`
  display: none;
  @media (min-width: ${SCREEN.TABLET}) {
    display: block;
    width: 80px;
    height: 54px;
    margin-top: 48px;
  }
`;

type Props = {
  step: number;
  index: number; // action index
};

const ConnectorsSelector = (props: Props) => {
  const { step, index } = props;
  const { devMode } = useAppContext();
  const {
    workflow,
    activeStep,
    updateWorkflow,
    setActiveStep,
    triggers,
    actions,
  } = useWorkflowContext();

  const triggerConnectorOptions = [
    ...triggers.connectorsWithTriggers
      .map((connector) => ({
        value: connector.key,
        label: connector.name,
        icon: connector.icon,
        paid: connector.pricing,
      }))
      .filter(
        (connector: any) =>
          !NOT_READY_TRIGGERS.find(
            (notReadyKey) => notReadyKey && notReadyKey === connector.value
          )
      ),
    ...[
      ...triggers.connectorsWithTriggers
        .map((connector) => ({
          value: connector.key,
          label: connector.name,
          icon: connector.icon,
          disabled: true,
          group: "Coming soon",
          paid: connector.pricing,
        }))
        .filter((connector: any) =>
          NOT_READY_TRIGGERS.find(
            (notReadyKey) => notReadyKey && notReadyKey === connector.value
          )
        ),
      ...COMING_SOON_TRIGGERS,
    ],
  ];

  const triggerConnectorValue = workflow.trigger.connector || "";

  const actionConnectorOptions = [
    ...actions.connectorsWithActions
      .map((connector) => ({
        value: connector.key,
        label: connector.name,
        icon: connector.icon,
        paid: connector.pricing,
      }))
      .filter(
        (connector: any) =>
          !NOT_READY_ACTIONS.find(
            (notReadyKey) => notReadyKey && notReadyKey === connector.value
          )
      ),
    ...[
      ...actions.connectorsWithActions
        .map((connector) => ({
          value: connector.key,
          label: connector.name,
          icon: connector.icon,
          disabled: true,
          group: "Coming soon",
          paid: connector.pricing,
        }))
        .filter((connector: any) =>
          NOT_READY_ACTIONS.find(
            (notReadyKey) => notReadyKey && notReadyKey === connector.value
          )
        ),
      ...COMING_SOON_ACTIONS,
    ],
  ];

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
      <AppsWrapper>
        <div style={{ marginTop: 40, position: "relative" }}>
          <InputWrapper>
            <Autocomplete
              label="This..."
              size="full"
              placeholder="Select a Trigger"
              onChange={handleTriggerConnectorChange}
              options={triggerConnectorOptions}
              value={triggerConnectorValue}
            />
          </InputWrapper>
          {triggerConnectorValue &&
            devMode &&
            triggers.triggerConnector?.html_url && (
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                <a
                  href={triggers.triggerConnector?.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    lineHeight: "150%",
                  }}
                >
                  Edit CDS file
                </a>
              </div>
            )}
        </div>
        <JoinImage src={ICONS.JOIN_CONNECTORS} alt="Add connectors" />
        <div style={{ marginTop: 10, position: "relative" }}>
          <InputWrapper>
            <Autocomplete
              label="With..."
              size="full"
              placeholder="Search for protocol"
              onChange={handleActionConnectorChange}
              options={actionConnectorOptions}
              value={actionConnectorValue}
            />
          </InputWrapper>
          {actionConnectorValue &&
            devMode &&
            actions.actionConnector(0)?.html_url && (
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                <a
                  href={actions.actionConnector(0)?.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    lineHeight: "150%",
                  }}
                >
                  Edit CDS file
                </a>
              </div>
            )}
        </div>
      </AppsWrapper>
      {triggers.triggerConnectorIsSet && actions.actionConnectorIsSet(index) && (
        <TriggerActionWrapper>
          <div style={{ marginTop: 40 }}>
            <Select
              label="When this happens..."
              type="default"
              placeholder="Select a Trigger"
              onChange={handleTriggerChange}
              options={triggerOptions}
              value={triggerValue}
            />
          </div>
          <JoinImage src={ICONS.JOIN_ACTIONS} alt="Add trigger and actions" />
          <div style={{ marginTop: 10 }}>
            <Select
              label="Then do this..."
              type="default"
              placeholder="Select an Action"
              onChange={handleActionChange}
              options={actionOptions}
              value={actionValue}
            />
          </div>
        </TriggerActionWrapper>
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
