import React from "react";
import styled from "styled-components";
import { Text } from "grindery-ui";
import Check from "./../icons/Check";
import { useWorkflowContext } from "../../context/WorkflowContext";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 20px;
  padding: 30px 20px 0;
`;

const Step = styled.div`
  width: calc(100% / 3 - 14px);
  text-align: center;
  position: relative;
`;

const Line = styled.div`
  height: 1px;
  background: #dcdcdc;
  position: absolute;
  left: calc(50% + 20px);
  top: 12.5px;
  transform: translateY(-50%);
  width: 78px;
`;

const ActiveStepIcon = styled.div`
  display: flex;
  margin: 0 auto 4px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #8c30f5;
  color: white;
`;

const InActiveStepIcon = styled.div`
  display: flex;
  margin: 0 auto 4px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #f4f5f7;
  color: white;
`;

type Props = {};

const WorkflowProgress = (props: Props) => {
  const { activeStep, setActiveStep } = useWorkflowContext();

  if (!activeStep) {
    return null;
  }

  const renderIcon = (index: number) => (
    <>
      {activeStep > index && <Check color="#8C30F5" />}
      {activeStep === index && (
        <ActiveStepIcon>
          <Text value={index.toString()} variant="body2" />
        </ActiveStepIcon>
      )}
      {activeStep < index && <InActiveStepIcon />}
    </>
  );

  const renderStep = (step: any) => (
    <Step
      style={{
        cursor: activeStep > step.index ? "pointer" : "default",
      }}
      key={step.index}
      onClick={() => {
        if (activeStep > step.index) {
          setActiveStep?.(step.index);
        }
      }}
    >
      {renderIcon(step.index)}
      <div>
        <Text value={step.label} variant="caption" />
      </div>
      {step.index < 3 && <Line />}
    </Step>
  );

  return (
    <Wrapper>
      {[
        { index: 1, label: "Connect (d)Apps" },
        { index: 2, label: "Set Up Trigger" },
        { index: 3, label: "Set Up Action" },
      ].map((step) => renderStep(step))}
    </Wrapper>
  );
};

export default WorkflowProgress;
