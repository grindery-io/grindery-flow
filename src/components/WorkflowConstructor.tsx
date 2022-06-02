import React from "react";
import TriggerConfiguration from "./TriggerConfiguration";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../context/AppContext";

type Props = {};

const WorkflowConstructor = (props: Props) => {
  const { workflow } = useAppContext();

  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );

  const actionIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].operation
  );

  const triggerIsConfigured = Boolean(
    workflow && workflow.trigger && workflow.trigger.authentication
  );

  return (
    <div style={{ padding: "0 20px 50px" }}>
      <ConnectorsSelector title="Create your own workflow" />
      {triggerIsSet && actionIsSet && <TriggerConfiguration />}
      {triggerIsSet && actionIsSet && triggerIsConfigured && (
        <ActionConfiguration />
      )}
    </div>
  );
};

export default WorkflowConstructor;
