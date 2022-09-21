import React from "react";
import styled from "styled-components";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import StepHeader from "./StepHeader";
import StepsDivider from "./StepsDivider";
import AddActionButton from "./AddActionButton";
import StepApp from "./StepApp";

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
  const { activeStep } = useWorkflowContext();

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
        <StepHeader type={type} step={step} />
        {activeStep === step && (
          <>
            <StepApp type={type} step={step} />
          </>
        )}
      </Container>
      <AddActionButton prevStep={step} />
    </>
  );
};

export default WorkflowStep;
