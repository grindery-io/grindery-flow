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
    isTriggerAuthenticationRequired,
  } = useAppContext();

  return (
    <div style={{ padding: "0 20px 50px" }}>
      <ConnectorsSelector title="Create your own workflow" />
      {triggerIsSet && actionIsSet && isTriggerAuthenticationRequired && (
        <TriggerAuthentication />
      )}
      {triggerIsSet &&
        actionIsSet &&
        (!isTriggerAuthenticationRequired || triggerIsAuthenticated) && (
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
