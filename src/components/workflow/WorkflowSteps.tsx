import React from "react";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../../context/AppContext";
import TriggerConfiguration from "./TriggerConfiguration";
import WorkflowProgress from "./WorkflowProgress";
import { useWorkflowContext } from "../../context/WorkflowContext";
import ActionTest from "./ActionTest";

type Props = {};

const WorkflowSteps = (props: Props) => {
  const { setWorkflowOpened } = useAppContext();
  const {
    triggerIsSet,
    actionIsSet,
    triggerIsAuthenticated,
    triggerIsConfigured,
    resetWorkflow,
    activeStep,
  } = useWorkflowContext();

  const closeConstructor = () => {
    setWorkflowOpened?.(false);
    resetWorkflow?.();
  };

  return (
    <div>
      {typeof activeStep === "number" ? (
        <>
          <WorkflowProgress />
          <ConnectorsSelector step={1} index={0} />
          {triggerIsSet && actionIsSet && <TriggerConfiguration step={2} />}
          {triggerIsSet &&
            actionIsSet &&
            triggerIsAuthenticated &&
            triggerIsConfigured && <ActionConfiguration index={0} step={3} />}
        </>
      ) : (
        <>{activeStep === "actionTest" && <ActionTest index={0} />}</>
      )}
    </div>
  );
};

export default WorkflowSteps;
