import React, { useState } from "react";
import TriggerConfiguration from "./TriggerConfiguration";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";

type Props = {};

const WorkflowConstructor = (props: Props) => {
  const [workflow, setWorkflow] = useState({
    title: "New workflow",
    trigger: {
      type: "trigger",
      connector: "",
      operation: "",
      input: {},
      display: {},
      authentication: "",
    },
    action: {
      type: "action",
      connector: "",
      operation: "",
      input: {},
      display: {},
      authentication: "",
    },
    creator: "demo:user",
    signature: "",
  });
  const [triggerIsConfigured, setTriggerIsConfigured] = useState(false);
  console.log("workflow", workflow);

  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );
  const actionIsSet = Boolean(
    workflow && workflow.action && workflow.action.operation
  );

  return (
    <div style={{ padding: "0 20px 50px" }}>
      <ConnectorsSelector
        title="Create your own workflow"
        workflow={workflow}
        setWorkflow={setWorkflow}
      />
      {triggerIsSet && actionIsSet && (
        <TriggerConfiguration setTriggerIsConfigured={setTriggerIsConfigured} />
      )}
      {triggerIsSet && actionIsSet && triggerIsConfigured && (
        <ActionConfiguration workflow={workflow} setWorkflow={setWorkflow} />
      )}
    </div>
  );
};

export default WorkflowConstructor;
