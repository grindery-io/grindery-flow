import React from "react";
import styled from "styled-components";
import { ICONS } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";

const Container = styled.div`
  padding: 20px 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  background: #f4f5f7;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  & img {
    display: block;
    width: 24px;
    height: 24px;
  }
`;

const AppIcon = styled.div`
  width: 56px;
  height: 56px;
  background: #ffffff;
  border-radius: 50%;
  border: 1px solid #706e6e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  & img {
    display: block;
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #898989;
  margin: 0;
  padding: 0;
`;

const Description = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 120%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
`;

const ChangeButton = styled.button`
  background: #ffffff;
  border: 1px solid #0b0d17;
  border-radius: 5px;
  padding: 12px 24px;
  box-shadow: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  margin-left: auto;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }
`;

type Props = {};

const StepHeader = (props: Props) => {
  const {
    type,
    step,
    setActiveRow,
    connector,
    operation,
    operationIsConfigured,
    operationIsAuthenticated,
    operationIsTested,
    setConnector,
    setOperationIsTested,
  } = useWorkflowStepContext();
  const { activeStep, setActiveStep, updateWorkflow, triggers, actions } =
    useWorkflowContext();

  const index = step - 2;

  const handleHeaderClick = () => {
    if (activeStep !== step) {
      setActiveStep(step);
    }
  };

  const handleChangeClick = () => {
    if (type === "trigger") {
      updateWorkflow({
        "trigger.connector": "",
        "trigger.input": {},
        "trigger.operation": "",
        "trigger.credentials": undefined,
      });
    } else {
      updateWorkflow({
        ["actions[" + index + "].connector"]: "",
        ["actions[" + index + "].input"]: {},
        ["actions[" + index + "].operation"]: "",
        ["actions[" + index + "].credentials"]: undefined,
      });
    }
    setActiveRow(0);
    setConnector(null);
    setOperationIsTested(false);
  };

  return (
    <Container
      style={{ cursor: activeStep === step ? "default" : "pointer" }}
      onClick={handleHeaderClick}
    >
      {connector && connector.icon ? (
        <AppIcon>
          <img src={connector.icon} alt="" />
        </AppIcon>
      ) : (
        <Icon>
          <img
            src={type === "trigger" ? ICONS.TRIGGER_ICON : ICONS.ACTION_ICON}
            alt=""
          />
        </Icon>
      )}

      <div>
        <Title>{type === "trigger" ? "Trigger" : "Action"}</Title>
        <Description style={{ fontSize: connector ? "20px" : "16px" }}>
          {connector
            ? connector.name
            : type === "trigger"
            ? "When this occurs..."
            : "Then do this..."}
          {connector && operation && <> - {operation.name}</>}
        </Description>
      </div>
      {activeStep !== step && connector && (
        <>
          <img
            style={{ marginLeft: "auto", display: "block" }}
            src={
              operation &&
              operationIsAuthenticated &&
              operationIsConfigured &&
              (type === "trigger" || operationIsTested)
                ? ICONS.CHECK_CIRCLE
                : ICONS.EXCLAMATION
            }
            alt=""
          />
        </>
      )}
      {connector && activeStep === step && (
        <ChangeButton onClick={handleChangeClick}>Change</ChangeButton>
      )}
    </Container>
  );
};

export default StepHeader;
