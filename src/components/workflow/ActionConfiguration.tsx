import React from "react";
import styled from "styled-components";
import { AlertField, Text, Button } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import { Field } from "../../types/Connector";
import ActionInputField from "./ActionInputField";
import { getOutputOptions } from "../../utils";
import { useWorkflowContext } from "../../context/WorkflowContext";
import ChainSelector from "./ChainSelector";
import GasInput from "./GasInput";
import { ICONS } from "../../constants";

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
  closeConstructor: () => void;
};

const ActionConfiguration = (props: Props) => {
  const { index, step, closeConstructor } = props;
  const { setWorkflows, workflows } = useAppContext();
  const {
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    triggerConnector,
    testWorkflowAction,
    workflow,
    updateWorkflow,
  } = useWorkflowContext();

  const inputFields = (action?.(index)?.operation?.inputFields || []).filter(
    (inputField: Field) => inputField && !inputField.computed
  );

  const options = getOutputOptions(trigger.operation, triggerConnector);

  const urlParams = new URLSearchParams(window.location.search);
  const testEngine = urlParams.get("testEngine");

  const handleTestClick = async () => {
    if (testWorkflowAction) {
      testWorkflowAction(index);
    }
  };

  const handleSaveClick = async () => {
    if (workflows && workflow) {
      setWorkflows?.([
        ...workflows,
        { ...workflow, id: new Date(), state: "on" },
      ]);
    }
    closeConstructor();
  };

  const handleChainChange = (val: any) => {
    updateWorkflow?.({
      ["actions[" + index + "].input.blockchain"]: val?.value || "",
    });
  };

  if (!activeStep || step !== activeStep) {
    return null;
  }

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
        <Text variant="h3" value="Set up Action" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${actionConnector?.(index)?.name}`} />
        </div>
      </TitleWrapper>

      <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
        <Text
          variant="h6"
          value={`Set fields${
            action?.(index)?.display.label
              ? " for " + action?.(index)?.display.label
              : ""
          }`}
        />
      </div>
      {action?.(index)?.operation?.type === "blockchain:call" && (
        <AlertField
          color="warning"
          icon={
            <img src={ICONS.GAS_ALERT} width={20} height={20} alt="gas icon" />
          }
        >
          <>
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
            <GasInput value="0.1" onChange={() => {}} />
          </>
        </AlertField>
      )}
      <div>
        {action?.(index)?.operation?.type === "blockchain:call" && (
          <ChainSelector
            value={workflow?.actions[index].input.blockchain || ""}
            onChange={handleChainChange}
          />
        )}
        {inputFields.map((inputField: Field) => (
          <ActionInputField
            key={inputField.key}
            inputField={inputField}
            options={options}
            index={index}
          />
        ))}
        {actionIsConfigured?.(index) && (
          <div style={{ marginTop: 40 }}>
            {testEngine === "1" ? (
              <Button
                onClick={handleTestClick}
                value="Test & Continue"
                color="primary"
              />
            ) : (
              <Button
                onClick={handleSaveClick}
                value="Save & Close"
                color="primary"
              />
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ActionConfiguration;
