import React from "react";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../../context/AppContext";
import TriggerConfiguration from "./TriggerConfiguration";
import WorkflowProgress from "./WorkflowProgress";
import { useWorkflowContext } from "../../context/WorkflowContext";

type Props = {};

const WorkflowSteps = (props: Props) => {
  const { setWorkflowOpened } = useAppContext();
  const {
    triggerIsSet,
    actionIsSet,
    triggerIsAuthenticated,
    triggerIsConfigured,
    resetWorkflow,
  } = useWorkflowContext();

  const closeConstructor = () => {
    setWorkflowOpened?.(false);
    resetWorkflow?.();
  };

  return (
    <div>
      <WorkflowProgress />
      <ConnectorsSelector step={1} index={0} />
      {triggerIsSet && actionIsSet && <TriggerConfiguration step={2} />}
      {triggerIsSet &&
        actionIsSet &&
        triggerIsAuthenticated &&
        triggerIsConfigured && (
          <ActionConfiguration
            index={0}
            step={3}
            closeConstructor={closeConstructor}
          />
        )}
    </div>
  );
};

export default WorkflowSteps;
