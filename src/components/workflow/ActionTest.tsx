import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useWorkflowContext } from "../../context/WorkflowContext";
import { Button, Text, AlertField, CircularProgress } from "grindery-ui";
import { Field } from "../../types/Connector";
import { jsonrpcObj, replaceTokens } from "../../utils";
import { ICONS, WORKFLOW_ENGINE_URL } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px 40px;
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const TitleIconWrapper = styled.div`
  display: inline-block;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  margin: 0px auto 10px;
`;

const TitleIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;

const TableWrapper = styled.div`
  margin: 0;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  padding: 4px 20px;

  & table {
    margin: 0;
    padding: 0;
    border: none;
    width: 100%;

    & tr {
      margin: 0;
      padding: 0;
      border: none;

      & td {
        width: 50%;
        padding: 20px 0;
        border-bottom: 1px solid #dcdcdc;
        box-sizing: border-box;
        word-break: break-word;

        &:first-child {
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          padding: 20px 10px 20px 0;
        }

        &:nth-child(2) {
          font-weight: 700;
          font-size: 16px;
          line-height: 150%;
        }
      }
    }

    & tr:last-child td {
      border-bottom: none;
    }
  }
`;

const RowLabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const RowIconWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 4px;

  & img {
    display: block;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 40px 0 0;

  & .MuiButton-root {
    width: auto !important;
  }
`;

const AlertWrapper = styled.div`
  margin: 0 0 20px;
`;

type Props = {
  index: number;
};

const ActionTest = (props: Props) => {
  const { index } = props;
  const {
    workflow,
    action,
    trigger,
    actionConnector,
    setActiveStep,
    saveWorkflow,
  } = useWorkflowContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const values = replaceTokens(workflow?.actions[index].input || {}, {
    trigger: trigger?.operation?.sample || {},
  });

  const rows =
    action?.(index)?.operation?.inputFields?.map((field: Field) => ({
      label: field.label || field.key,
      icon: actionConnector?.(index)?.icon,
      value: values[field.key] || "",
    })) || [];

  const handleTestClick = () => {
    testWorkflowAction?.(index);
  };

  const handleBackClick = () => {
    setActiveStep?.(3);
  };

  const handleSaveClick = async () => {
    saveWorkflow?.();
  };

  const testWorkflowAction = (index: number) => {
    if (workflow) {
      if (workflow.actions && workflow.actions[index]) {
        setError(null);
        setSuccess(null);
        setLoading(true);
        axios
          .post(
            WORKFLOW_ENGINE_URL,
            jsonrpcObj("or_testAction", {
              userAccountId: workflow.creator,
              step: workflow.actions[index],
              input: replaceTokens(workflow.actions[index].input || {}, {
                trigger: trigger?.operation?.sample || {},
              }),
            })
          )
          .then((res) => {
            if (res && res.data && res.data.error) {
              setError(res.data.error.message || null);
            }
            if (res && res.data && res.data.result) {
              setSuccess("Test action sent!");
            }
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message || null);
            setLoading(false);
          });
      }
    }
  };

  return (
    <Wrapper>
      <TitleWrapper>
        {actionConnector?.(index)?.icon && (
          <TitleIconWrapper>
            <TitleIcon
              src={actionConnector?.(index)?.icon}
              alt={`${actionConnector?.(index)?.name} icon`}
            />
          </TitleIconWrapper>
        )}
        <Text variant="h3" value="Let's test this workflow" />
        <div style={{ marginTop: 4 }}>
          <Text
            variant="p"
            value="We will test the action to verify all works."
          />
        </div>
      </TitleWrapper>
      {success && (
        <AlertWrapper>
          <AlertField
            color="success"
            icon={
              <img
                src={ICONS.SUCCESS_ALERT}
                width={20}
                height={20}
                alt="success icon"
              />
            }
          >
            <div style={{ textAlign: "left" }}>{success}</div>
          </AlertField>
        </AlertWrapper>
      )}
      {error && (
        <AlertWrapper>
          <AlertField
            color="error"
            icon={
              <img
                src={ICONS.ERROR_ALERT}
                width={20}
                height={20}
                alt="error icon"
              />
            }
          >
            <div style={{ textAlign: "left" }}>{error}</div>
          </AlertField>
        </AlertWrapper>
      )}
      <TableWrapper>
        <table>
          {rows.map((row) => (
            <tr>
              <td>
                <RowLabelWrapper>
                  {row.icon && (
                    <RowIconWrapper>
                      <img src={row.icon} alt={row.label} />
                    </RowIconWrapper>
                  )}
                  {row.label}
                </RowLabelWrapper>
              </td>
              <td>{row.value}</td>
            </tr>
          ))}
        </table>
      </TableWrapper>
      <ButtonsWrapper>
        <Button
          value="Back"
          variant="outlined"
          onClick={handleBackClick}
          color="primary"
          disabled={loading}
        />

        {success ? (
          <Button
            value="Workflow list"
            color="primary"
            onClick={handleSaveClick}
            disabled={loading}
          />
        ) : (
          <Button
            value="Send test!"
            color="primary"
            onClick={handleTestClick}
            disabled={loading}
          />
        )}
      </ButtonsWrapper>
      {loading && (
        <div style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}>
          <CircularProgress color="inherit" />
        </div>
      )}
    </Wrapper>
  );
};

export default ActionTest;
