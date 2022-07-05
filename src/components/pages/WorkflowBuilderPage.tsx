import React from "react";
import useAppContext from "../../hooks/useAppContext";
import WorkflowContextProvider from "../../context/WorkflowContext";
import WorkflowSteps from "../workflow/WorkflowSteps";

type Props = {};

const WorkflowBuilderPage = (props: Props) => {
  const { user, connectors } = useAppContext();

  if (!connectors || !connectors.length) {
    return null;
  }

  return (
    <WorkflowContextProvider user={user}>
      <WorkflowSteps />
    </WorkflowContextProvider>
  );
};

export default WorkflowBuilderPage;
