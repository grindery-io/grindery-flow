import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AutoCompleteInput, SelectInput } from "grindery-ui";
import { Field } from "../../types/Connector";
import { useWorkflowContext } from "../../context/WorkflowContext";

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
};

const ActionInputField = ({ inputField, options, index }: Props) => {
  const { updateWorkflow, workflow } = useWorkflowContext();

  const fieldOptions = inputField.choices?.map((choice) => ({
    value: typeof choice !== "string" ? choice.value : choice,
    label: typeof choice !== "string" ? choice.label : choice,
    //icon: triggerConnector ? triggerConnector.icon || "" : "",
  }));

  const workflowValue = workflow?.actions[index].input[inputField.key];
  const [val, setVal]: any = useState(
    workflowValue
      ? workflowValue
          ?.toString()
          .split(" ")
          .map(
            (v) =>
              options.find((o: any) => o.value === v) || { value: v, label: v }
          )
      : inputField.default
      ? [{ value: inputField.default, label: inputField.default }]
      : []
  );

  const handleFieldChange = (value: any) => {
    setVal(Array.isArray(value) ? value : [value]);
  };

  useEffect(() => {
    const wfValue = Array.isArray(val)
      ? val.map((v) => (v.value ? v.value : v)).join(" ")
      : val.value
      ? val.value
      : val;

    updateWorkflow?.({
      ["actions[" + index + "].input." + inputField.key]: wfValue || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val, index, inputField]);

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && (
        <InputWrapper>
          {inputField.choices ? (
            <SelectInput
              label={inputField.label || ""}
              type="default"
              placeholder={inputField.placeholder || ""}
              onChange={handleFieldChange}
              options={fieldOptions}
              value={Array.isArray(val) ? val : [val]}
              tooltip={inputField.helpText}
              required={!!inputField.required}
            />
          ) : (
            <AutoCompleteInput
              label={inputField.label || ""}
              type="searchLabel"
              variant="full"
              placeholder={inputField.placeholder || ""}
              required={!!inputField.required}
              tooltip={inputField.helpText || false}
              options={options}
              onChange={handleFieldChange}
              value={val}
            />
          )}
        </InputWrapper>
      )}
    </React.Fragment>
  );
};

export default ActionInputField;
