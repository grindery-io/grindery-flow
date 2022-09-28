import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { CircularProgress } from "grindery-ui";
import { ICONS, isLocalOrStaging } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import { Field } from "../../types/Connector";
import { replaceTokens } from "../../helpers/utils";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";

const Container = styled.div`
  border-top: 1px solid #dcdcdc;
`;

const Header = styled.div`
    padding: 12px 32px; 12px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 16px;
    cursor: pointer;

    & span {
        font-weight: 700;
        font-size: 16px;
        line-height: 120%;
        color: #0B0D17;
    }

    &.active {
      cursor: default;
    }
    &:not(.active):hover {
      background: #F4F5F7;
    }
`;

const OperationStateIcon = styled.img`
  display: block;
  margin-left: auto;
`;

const Content = styled.div`
  padding: 0 32px 20px;
  position: relative;
`;

const Button = styled.button`
  box-shadow: none;
  background: #0b0d17;
  border-radius: 5px;
  border: 1px solid #0b0d17;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }

  &:disabled {
    background: #dcdcdc;
    color: #706e6e;
    border-color: #dcdcdc;
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div`
  text-align: right;
  padding-bottom: 12px;
`;

const TableWrapper = styled.div`
  margin: 0 0 16px;

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
          width: 40%;
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          padding: 20px 10px 20px 0;
          vertical-align: top;
        }

        &:nth-child(2) {
          width: 60%;
          font-weight: 700;
          font-size: 16px;
          line-height: 150%;
          text-align: right;
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
    width: 16px;
    height: 16px;
  }
`;

const SuccessWrapper = styled.div``;

const SuccessIcons = styled.div``;

const SuccessTitle = styled.h3``;

const SuccessDescription = styled.p``;

const IconWrapper = styled.div``;

const ArrowIcon = styled.img``;

type Props = {
  outputFields: any[];
};

const StepTest = ({ outputFields }: Props) => {
  const {
    type,
    step,
    activeRow,
    setActiveRow,
    connector,
    operation,
    operationIsConfigured,
    operationIsAuthenticated,
    setOperationIsTested,
  } = useWorkflowStepContext();
  const { workflow, updateWorkflow, loading, setLoading } =
    useWorkflowContext();
  const { client } = useAppContext();
  const index = step - 2;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const operationIsTested =
    type === "trigger"
      ? workflow.system?.trigger?.tested
      : workflow.system?.actions?.[index]?.tested;

  /*const options = _.flatten([
    ...(outputFields.map((out) => out?.operation?.sample) || []),
  ]);

  console.log("test options", operation);*/

  const values = replaceTokens(workflow.actions[index]?.input || {}, {
    trigger: {},
  });

  const rows =
    operation?.operation?.inputFields?.map((field: Field) => {
      const v = values[field.key];
      return {
        label: field.label || field.key,
        icon: connector?.icon,
        value: Array.isArray(v) ? v.join("\n") : v || "",
      };
    }) ||
    operation?.inputFields?.map((field: Field) => {
      const v = values[field.key];
      return {
        label: field.label || field.key,
        icon: connector?.icon,
        value: Array.isArray(v) ? v.join("\n") : v || "",
      };
    }) ||
    [];

  const testWorkflowAction = async (index: number) => {
    if (workflow) {
      if (workflow.actions && workflow.actions[index]) {
        setError(null);
        setSuccess(null);
        setLoading(true);
        const res = await client
          ?.testAction(
            workflow.actions[index],
            values,
            isLocalOrStaging ? "staging" : undefined
          )
          .catch((err) => {
            console.error("testAction error:", err.message);
            setError(err.message || null);
            setOperationIsTested(false);
          });

        if (res) {
          setSuccess("Test action sent!");
          setOperationIsTested(true);
        } else {
          setOperationIsTested(false);
        }
        setLoading(false);
      }
    }
  };

  const renderValue = (value: any) => (
    <>
      {value.split("\n").map((v: any) => (
        <p style={{ padding: "5px 0", margin: "0px" }}>{v}</p>
      ))}
    </>
  );

  const handleHeaderClick = () => {
    setActiveRow(3);
  };

  const handleContinueClick = () => {
    testWorkflowAction(index);
  };

  return operation && operationIsAuthenticated && operationIsConfigured ? (
    <Container>
      <Header
        onClick={handleHeaderClick}
        className={activeRow === 3 ? "active" : ""}
      >
        {activeRow === 3 ? (
          <img src={ICONS.ANGLE_UP} alt="" />
        ) : (
          <img src={ICONS.ANGLE_DOWN} alt="" />
        )}
        <span>{type === "trigger" ? "Test trigger" : "Test action"}</span>

        <OperationStateIcon
          src={operationIsTested ? ICONS.CHECK_CIRCLE : ICONS.EXCLAMATION}
          alt=""
        />
      </Header>
      {activeRow === 3 && (
        <Content>
          {operationIsTested ? (
            <SuccessWrapper>
              <SuccessIcons>
                <IconWrapper>
                  <img src="" alt="" />
                </IconWrapper>
                <ArrowIcon />
                <IconWrapper>
                  <img src="" alt="" />
                </IconWrapper>
              </SuccessIcons>
              <SuccessTitle>
                {type === "trigger" ? "" : "Action success!"}
              </SuccessTitle>
              <SuccessDescription>
                {type === "trigger"
                  ? ""
                  : "Now you can save this workflow or add another action."}
              </SuccessDescription>
            </SuccessWrapper>
          ) : (
            <>
              <TableWrapper>
                <table>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={`${row.value}_${i}`}>
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
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {renderValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "32px",
                    left: 0,
                    textAlign: "center",
                    color: "#8C30F5",
                    width: "100%",
                  }}
                >
                  <CircularProgress color="inherit" />
                </div>
              )}
              <ButtonWrapper>
                <Button disabled={loading} onClick={handleContinueClick}>
                  Send test!
                </Button>
              </ButtonWrapper>
            </>
          )}
        </Content>
      )}
    </Container>
  ) : null;
};

export default StepTest;
