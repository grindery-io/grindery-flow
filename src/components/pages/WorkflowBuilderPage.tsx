import React from "react";
import useAppContext from "../../hooks/useAppContext";
import WorkflowContextProvider from "../../context/WorkflowContext";
import WorkflowSteps from "../workflow/WorkflowSteps";

type Props = {};

const WorkflowBuilderPage = (props: Props) => {
  const { user, connectors } = useAppContext();

  return (
    <WorkflowContextProvider user={user} availableConnectors={connectors || []}>
      <WorkflowSteps />
    </WorkflowContextProvider>
  );
};

export default WorkflowBuilderPage;
