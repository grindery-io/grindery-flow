import React from "react";
import styled from "styled-components";
import { RichInput, SelectInput, AutoCompleteInput } from "grindery-ui";
import { Field } from "../../types/Connector";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import { BLOCKCHAINS } from "../../constants";

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  & > .MuiBox-root > .MuiBox-root {
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

type Props = {
  inputField: Field;
  options: any;
  index: any;
  addressBook: any;
  setAddressBook?: (i: any) => void;
  setActionError: (i: string) => void;
};

const ActionInputField = ({
  inputField,
  options,
  index,
  addressBook,
  setAddressBook,
  setActionError,
}: Props) => {
  const { user } = useAppContext();
  const { updateWorkflow, workflow } = useWorkflowContext();

  const fieldOptions = inputField.choices?.map((choice) => ({
    value: typeof choice !== "string" ? choice.value : choice,
    label: typeof choice !== "string" ? choice.label : choice,
  }));

  const booleanOptions = [
    {
      value: "true",
      label: "True",
      icon: "",
    },
    { value: "false", label: "False", icon: "" },
  ];

  const workflowValue = (
    workflow.actions[index].input[inputField.key] || ""
  ).toString();

  const handleFieldChange = (value: string) => {
    setActionError("");
    updateWorkflow({
      ["actions[" + index + "].input." + inputField.key]: (value || "").trim(),
    });
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "boolean":
        return (
          <SelectInput
            label={inputField.label || ""}
            type="default"
            placeholder={inputField.placeholder || ""}
            onChange={handleFieldChange}
            options={booleanOptions}
            value={workflowValue}
            tooltip={inputField.helpText}
            required={!!inputField.required}
          />
        );
      default:
        return inputField.choices ? (
          <AutoCompleteInput
            label={inputField.label || ""}
            size="full"
            placeholder={inputField.placeholder || ""}
            onChange={handleFieldChange}
            options={fieldOptions}
            value={workflowValue}
            tooltip={inputField.helpText}
            required={!!inputField.required}
          />
        ) : inputField.key === "_grinderyChain" ? (
          <AutoCompleteInput
            label={inputField.label || ""}
            size="full"
            placeholder={inputField.placeholder || ""}
            onChange={handleFieldChange}
            options={BLOCKCHAINS}
            value={workflowValue}
            tooltip={inputField.helpText}
            required={!!inputField.required}
          />
        ) : (
          <RichInput
            label={inputField.label || ""}
            placeholder={inputField.placeholder || ""}
            required={!!inputField.required}
            tooltip={inputField.helpText || false}
            options={options}
            onChange={handleFieldChange}
            value={workflowValue}
            user={user}
            hasAddressBook={inputField.type === "address"}
            addressBook={addressBook}
            setAddressBook={setAddressBook}
          />
        );
    }
  };

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && <InputWrapper>{renderField(inputField)}</InputWrapper>}
    </React.Fragment>
  );
};

export default ActionInputField;
