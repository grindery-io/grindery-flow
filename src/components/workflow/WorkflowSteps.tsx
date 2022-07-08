import React from "react";
import styled from "styled-components";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import TriggerConfiguration from "./TriggerConfiguration";
import WorkflowProgress from "./WorkflowProgress";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import ActionTest from "./ActionTest";
import { SCREEN } from "../../constants";

const Wrapper = styled.div`
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 10px 20px 10px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 30px 86px 30px;
    margin: 40px 20px 0;
  }
`;

type Props = {};

const WorkflowSteps = (props: Props) => {
  const { actions, activeStep, triggers } = useWorkflowContext();
  const { actionIsSet } = actions;

  return (
    <Wrapper>
      {typeof activeStep === "number" ? (
        <>
          <WorkflowProgress />
          <ConnectorsSelector step={1} index={0} />
          {triggers.triggerIsSet && actionIsSet(0) && (
            <TriggerConfiguration step={2} />
          )}
          {triggers.triggerIsSet &&
            actionIsSet(0) &&
            triggers.triggerIsAuthenticated &&
            triggers.triggerIsConfigured && (
              <ActionConfiguration index={0} step={3} />
            )}
        </>
      ) : (
        <>{activeStep === "actionTest" && <ActionTest index={0} />}</>
      )}
    </Wrapper>
  );
};

export default WorkflowSteps;
