import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TextInput } from "grindery-ui";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import {
  COMING_SOON_ACTIONS,
  COMING_SOON_TRIGGERS,
  NOT_READY_ACTIONS,
  NOT_READY_TRIGGERS,
} from "../../constants";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";

const Container = styled.div`
  border-top: 1px solid #dcdcdc;
  padding: 32px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

const Option = styled.button`
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
  background: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
  width: 100%;
  max-width: calc(100% / 3 - 10.7px);
`;

const OptionIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  box-sizing: border-box;

  & img {
    width: 16px;
    height: 16px;
    display: block;
  }
`;
const OptionTitle = styled.p`
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/*const OptionDescription = styled.p`
  font-weight: 400;
  font-size: 10px;
  line-height: 160%;
  color: #898989;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;*/

const Showing = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 160%;
  text-align: center;
  color: #706e6e;
  margin: 16px 0 0;
  padding: 0;
`;

type Props = {};

const StepApp = (props: Props) => {
  const { type, step, getConnector } = useWorkflowStepContext();
  const { workflow, updateWorkflow, triggers, actions, activeStep } =
    useWorkflowContext();
  const [search, setSearch] = useState("");
  const index = step - 2;
  const opened =
    (type === "trigger" && !workflow.trigger.connector) ||
    (type === "action" && !workflow.actions[step - 2]?.connector);

  const options =
    type === "trigger"
      ? [
          ...triggers.connectorsWithTriggers
            .map((connector) => ({
              value: connector.key,
              label: connector.name,
              icon: connector.icon,
              paid: connector.pricing,
            }))
            .filter(
              (connector: any) =>
                !NOT_READY_TRIGGERS.find(
                  (notReadyKey) =>
                    notReadyKey && notReadyKey === connector.value
                )
            ),
          /*...[
            ...triggers.connectorsWithTriggers
              .map((connector) => ({
                value: connector.key,
                label: connector.name,
                icon: connector.icon,
                disabled: true,
                group: "Coming soon",
                paid: connector.pricing,
              }))
              .filter((connector: any) =>
                NOT_READY_TRIGGERS.find(
                  (notReadyKey) =>
                    notReadyKey && notReadyKey === connector.value
                )
              ),
            ...COMING_SOON_TRIGGERS,
          ],*/
        ]
      : [
          ...actions.connectorsWithActions
            .map((connector) => ({
              value: connector.key,
              label: connector.name,
              icon: connector.icon,
              paid: connector.pricing,
            }))
            .filter(
              (connector: any) =>
                !NOT_READY_ACTIONS.find(
                  (notReadyKey) =>
                    notReadyKey && notReadyKey === connector.value
                )
            ),
          /*...[
            ...actions.connectorsWithActions
              .map((connector) => ({
                value: connector.key,
                label: connector.name,
                icon: connector.icon,
                disabled: true,
                group: "Coming soon",
                paid: connector.pricing,
              }))
              .filter((connector: any) =>
                NOT_READY_ACTIONS.find(
                  (notReadyKey) =>
                    notReadyKey && notReadyKey === connector.value
                )
              ),
            //...COMING_SOON_ACTIONS,
          ],*/
        ];

  const visibleOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 12);

  const value =
    type === "trigger"
      ? workflow.trigger.connector || ""
      : workflow.actions[index]?.connector || "";

  const handleOptionClick = (value: string) => {
    if (type === "trigger") {
      updateWorkflow({
        "trigger.connector": value || "",
        "trigger.input": {},
        "trigger.operation": "",
        "trigger.credentials": undefined,
      });
    } else {
      updateWorkflow({
        ["actions[" + index + "].connector"]: value || "",
        ["actions[" + index + "].input"]: {},
        ["actions[" + index + "].operation"]: "",
        ["actions[" + index + "].credentials"]: undefined,
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    if (value) {
      getConnector(value);
    }
  }, [value]);

  if (!opened) {
    return null;
  }
  return activeStep === step ? (
    <Container>
      <TextInput
        value={search}
        onChange={handleSearchChange}
        label={type === "trigger" ? "Select a trigger" : "Select an action"}
        placeholder="Search use case or protocol"
        icon="search"
        type="input-icon"
      />
      <Options>
        {visibleOptions.map((option) => (
          <Option
            key={option.value}
            onClick={() => {
              handleOptionClick(option.value);
            }}
          >
            <OptionIcon>
              <img src={option.icon} alt="" />
            </OptionIcon>
            <div>
              <OptionTitle>{option.label}</OptionTitle>
            </div>
          </Option>
        ))}
      </Options>
      <Showing>
        Showing {visibleOptions.length} out of {options.length} results
      </Showing>
    </Container>
  ) : null;
};

export default StepApp;
