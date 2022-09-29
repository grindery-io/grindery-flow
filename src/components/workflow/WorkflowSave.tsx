import React from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import styled from "styled-components";
import useAppContext from "../../hooks/useAppContext";
import useWorkflowContext from "../../hooks/useWorkflowContext";

const Container = styled.div`
  margin: 48px auto 0;
  text-align: center;
`;

const Button = styled.button`
  border: none;
  background: #8c30f5;
  padding: 9.5px 16px;
  font-family: "Roboto";
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: none;

  &:hover {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }

  &:disabled {
    background: #dcdcdc;
    cursor: not-allowed;
    color: #706e6e;
  }

  &:disabled:hover {
    box-shadow: none;
  }
`;

type Props = {};

const WorkflowSave = (props: Props) => {
  const { workflow, workflowReadyToSave, saveWorkflow } = useWorkflowContext();
  const { editWorkflow } = useAppContext();
  const { key } = useParams();
  let navigate = useNavigate();

  const handleClick = async () => {
    if (key) {
      const wf = { ...workflow };
      delete wf.signature;
      delete wf.system;

      editWorkflow(
        {
          ...wf,
          signature: JSON.stringify(wf),
        },
        true
      );
    } else {
      saveWorkflow();
    }
  };

  return (
    <Container>
      <Button onClick={handleClick} disabled={!workflowReadyToSave}>
        Save workflow
      </Button>
    </Container>
  );
};

export default WorkflowSave;
