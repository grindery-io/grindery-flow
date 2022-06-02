import React from "react";
import TriggerAuthentication from "./TriggerAuthentication";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../context/AppContext";
import TriggerConfiguration from "./TriggerConfiguration";

type Props = {};

const WorkflowConstructor = (props: Props) => {
  const {
    triggerIsSet,
    actionIsSet,
    triggerIsAuthenticated,
    triggerIsConfigured,
  } = useAppContext();

  return (
    <div style={{ padding: "0 20px 50px" }}>
      <ConnectorsSelector title="Create your own workflow" />
      {triggerIsSet && actionIsSet && <TriggerAuthentication />}
      {triggerIsSet && actionIsSet && triggerIsAuthenticated && (
        <TriggerConfiguration />
      )}
      {triggerIsSet &&
        actionIsSet &&
        triggerIsAuthenticated &&
        triggerIsConfigured && <ActionConfiguration />}
    </div>
  );
};

export default WorkflowConstructor;
