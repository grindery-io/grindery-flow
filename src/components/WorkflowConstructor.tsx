import React, { useState } from "react";
import ConnectorsSelector from "./ConnectorsSelector";

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

  console.log("workflow", workflow);

  return (
    <div style={{ padding: "0 20px" }}>
      <ConnectorsSelector
        title="Create your own workflow"
        workflow={workflow}
        setWorkflow={setWorkflow}
      />
    </div>
  );
};

export default WorkflowConstructor;
