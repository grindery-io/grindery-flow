import React from "react";
import styled from "styled-components";
import { ICONS } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { Operation } from "../../types/Workflow";
import StepsDivider from "./StepsDivider";

const defaultAction: Operation = {
  type: "action",
  connector: "",
  operation: "",
  input: {},
};

const Button = styled.button`
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const Icon = styled.img`
  display: block;
  width: 32px;
  height: 32px;
`;

type Props = {
  prevStep: number;
};

const AddActionButton = (props: Props) => {
  const { prevStep } = props;
  const { workflow, setActiveStep, setWorkflow } = useWorkflowContext();

  const newIndex = prevStep - 1;

  const handleClick = () => {
    const currentWorkflow = { ...workflow };
    const currentActions = currentWorkflow.actions;
    const newActions = [
      ...currentActions.slice(0, newIndex),
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
      },
      ...currentActions.slice(newIndex),
    ];
    setWorkflow({ ...currentWorkflow, actions: newActions });
    setActiveStep(prevStep + 1);
  };

  return (
    <>
      <StepsDivider height={16} />
      <Button onClick={handleClick}>
        <Icon src={ICONS.ADD_STEP} alt="" />
      </Button>
    </>
  );
};

export default AddActionButton;
