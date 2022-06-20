import React from "react";
import useAppContext from "../../hooks/useAppContext";
import WorkflowContextProvider from "../../context/WorkflowContext";
import WorkflowSteps from "./WorkflowSteps";

type Props = {};

const WorkflowBuilder = (props: Props) => {
  const { user, connectors } = useAppContext();

  return (
    <WorkflowContextProvider user={user} availableConnectors={connectors || []}>
      <WorkflowSteps />
    </WorkflowContextProvider>
  );
};

export default WorkflowBuilder;
