import React, { useState } from "react";
import styled from "styled-components";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import StepHeader from "./StepHeader";
import StepsDivider from "./StepsDivider";
import AddActionButton from "./AddActionButton";
import StepApp from "./StepApp";
import StepOperation from "./StepOperation";
import StepAuthentication from "./StepAuthentication";
import StepInput from "./StepInput";

const Container = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  width: 100%;
`;

type Props = {
  type: "trigger" | "action";
  index: number;
  step: number;
};

const WorkflowStep = (props: Props) => {
  const { type, step } = props;
  const { activeStep, connectors, workflow, triggers, actions } =
    useWorkflowContext();
  const [activeRow, setActiveRow] = useState(0);
  const [username, setUsername] = useState("");

  const index = step - 2;

  const currentConnector =
    type === "trigger"
      ? connectors.find(
          (connector) => connector.key === workflow.trigger.connector
        )
      : connectors.find(
          (connector) => connector.key === workflow.actions[index].connector
        );

  const currentOperation =
    type === "trigger"
      ? currentConnector?.triggers?.find(
          (trigger) => trigger.key === workflow.trigger.operation
        )
      : currentConnector?.actions?.find(
          (action) => action.key === workflow.actions[index].operation
        );

  const isAuthenticated =
    type === "trigger"
      ? triggers.triggerIsAuthenticated
      : actions.actionIsAuthenticated(index);

  return (
    <>
      {type === "action" ? <StepsDivider height={16} /> : null}
      <Container
        style={{
          boxShadow:
            activeStep === step
              ? "0px 10px 40px -3px rgba(0, 0, 0, 0.04)"
              : "none",
        }}
      >
        <StepHeader
          type={type}
          step={step}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
        />
        {activeStep === step && (
          <>
            <StepApp type={type} step={step} />
            <StepOperation
              type={type}
              step={step}
              activeRow={activeRow}
              setActiveRow={setActiveRow}
            />
            {currentOperation && (
              <StepAuthentication
                username={username}
                setUsername={setUsername}
                type={type}
                step={step}
                activeRow={activeRow}
                setActiveRow={setActiveRow}
              />
            )}

            {currentOperation && isAuthenticated && (
              <StepInput
                type={type}
                step={step}
                activeRow={activeRow}
                setActiveRow={setActiveRow}
              />
            )}
          </>
        )}
      </Container>
      <AddActionButton prevStep={step} />
    </>
  );
};

export default WorkflowStep;
