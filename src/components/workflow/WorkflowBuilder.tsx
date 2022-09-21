import React from "react";
import styled from "styled-components";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { SCREEN } from "../../constants";
import WorkflowStep from "./WorkflowStep";

const Wrapper = styled.div`
  max-width: 816px;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: flex-start;
  flex-wrap: nowrap;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 0;
    margin: 40px auto 0;
  }
`;

type Props = {};

const WorkflowBuilder = (props: Props) => {
  const { actions, activeStep, workflow } = useWorkflowContext();
  const { actionIsSet } = actions;

  return (
    <Wrapper>
      <WorkflowStep type="trigger" index={0} step={1} />
      {workflow.actions.map((action, index) => (
        <WorkflowStep
          key={index}
          type="action"
          index={index}
          step={index + 2}
        />
      ))}
    </Wrapper>
  );
};

export default WorkflowBuilder;
