import React from "react";
import styled from "styled-components";
import { AlertField, Text, Button } from "grindery-ui";
import { useAppContext } from "../context/AppContext";
import { Field } from "../types/Connector";
import ActionInputField from "./ActionInputField";
import { getOutputOptions } from "../utils";

const Wrapper = styled.div`
  padding: 20px 20px 40px;
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
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

type Props = {
  index: number;
  step: number;
};

const ActionConfiguration = (props: Props) => {
  const { index, step } = props;
  const {
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    triggerConnector,
    testWorkflowAction,
  } = useAppContext();

  const inputFields =
    action &&
    action.operation &&
    action.operation.inputFields &&
    action.operation.inputFields.filter(
      (inputField: { computed: any }) => inputField && !inputField.computed
    );

  const options = getOutputOptions(trigger.operation, triggerConnector);

  const handleTestClick = async () => {
    if (testWorkflowAction) {
      testWorkflowAction(index);
    }
  };

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        {actionConnector.icon && (
          <TitleIconWrapper>
            <TitleIcon
              src={actionConnector.icon}
              alt={`${actionConnector.name} icon`}
            />
          </TitleIconWrapper>
        )}
        <Text variant="h3" value="Set up Action" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${actionConnector.name}`} />
        </div>
      </TitleWrapper>

      <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
        <Text
          variant="h6"
          value={`Set fields${
            action && action.display && action.display.label
              ? " for " + action.display.label
              : ""
          }`}
        />
      </div>
      {action &&
        action.operation &&
        action.operation.type === "blockchain:call" && (
          <AlertField
            text={
              <div style={{ textAlign: "left" }}>
                This action will require you to pay gas. Make sure your account
                has funds. Current balance:{" "}
                <a
                  href="#balance"
                  style={{
                    fontWeight: "bold",
                    color: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  0.003 ETH
                </a>
              </div>
            }
            color="warning"
            icon={
              <img
                src="/images/exclamation.png"
                width={20}
                height={20}
                alt="exclamation icon"
              />
            }
          />
        )}
      <div>
        {inputFields.map((inputField: Field) => (
          <ActionInputField
            key={inputField.key}
            inputField={inputField}
            options={options}
            index={index}
          />
        ))}
        {actionIsConfigured && (
          <div style={{ marginTop: 40 }}>
            <Button
              onClick={handleTestClick}
              value="Test & Continue"
              color="primary"
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ActionConfiguration;
