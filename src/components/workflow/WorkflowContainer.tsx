import React from "react";
import WorkflowContextProvider from "../../context/WorkflowContext";
import WorkflowBuilder from "./WorkflowBuilder";

type Props = {};

const WorkflowContainer = (props: Props) => {
  return (
    <WorkflowContextProvider>
      <WorkflowBuilder />
    </WorkflowContextProvider>
  );
};

export default WorkflowContainer;
