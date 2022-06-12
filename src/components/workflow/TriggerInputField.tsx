import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SelectInput, InputBox } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import { Field } from "../../types/Connector";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

type Props = {
  inputField: Field;
};

const TriggerInputField = ({ inputField }: Props) => {
  const { triggerConnector, workflow, updateWorkflow } = useAppContext();

  const fieldOptions = inputField.choices?.map((choice) => ({
    value: typeof choice !== "string" ? choice.value : choice,
    label: typeof choice !== "string" ? choice.label : choice,
    icon: triggerConnector ? triggerConnector.icon || "" : "",
  }));

  const booleanOptions = [
    {
      value: "true",
      label: "True",
      icon: "",
    },
    { value: "false", label: "False", icon: "" },
  ];

  const workflowValue = workflow?.trigger.input[inputField.key] || "";

  const [val, setVal]: any = useState(
    fieldOptions
      ? fieldOptions?.find(
          (opt) =>
            opt.value === (workflowValue && workflowValue.toString()) || ""
        ) || []
      : inputField.type === "boolean"
      ? workflowValue || inputField.default
        ? booleanOptions[0]
        : booleanOptions[1]
      : (workflowValue && workflowValue.toString()) ||
        (inputField.default && inputField.default.toString()) ||
        ""
  );

  const handleFieldChange = (e: any) => {
    setVal(
      (inputField.type === "string" || inputField.type === "number") &&
        !fieldOptions
        ? e?.target.value || ""
        : e
    );
  };

  useEffect(() => {
    let newVal: any = "";
    if (
      (inputField.type === "string" && inputField.choices) ||
      inputField.type === "boolean"
    ) {
      newVal = val?.value || "";
      if (inputField.type === "boolean") {
        newVal = newVal === "true";
      }
    }
    if (inputField.type === "string" && !fieldOptions) {
      newVal = val;
    }
    if (inputField.type === "number" && !fieldOptions) {
      newVal = parseFloat(val);
    }
    updateWorkflow?.({
      ["trigger.input." + inputField.key]: newVal,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && (
        <Wrapper>
          {(inputField.type === "number" ||
            (inputField.type === "string" && !inputField.choices)) && (
            <InputBox
              value={val || ""}
              label={inputField.label || ""}
              placeholder={inputField.placeholder || ""}
              texthelper={inputField.helpText || ""}
              required={!!inputField.required}
              onChange={handleFieldChange}
            ></InputBox>
          )}
          {inputField.type === "boolean" && (
            <SelectInput
              label={inputField.label || ""}
              type="default"
              placeholder={inputField.placeholder || ""}
              onChange={handleFieldChange}
              options={booleanOptions}
              value={Array.isArray(val) ? val : [val]}
              texthelper={inputField.helpText || ""}
              required={!!inputField.required}
            />
          )}
          {inputField.choices && (
            <SelectInput
              label={inputField.label || ""}
              type="default"
              placeholder={inputField.placeholder || ""}
              onChange={handleFieldChange}
              options={fieldOptions}
              value={Array.isArray(val) ? val : [val]}
              texthelper={inputField.helpText || ""}
              required={!!inputField.required}
            />
          )}
        </Wrapper>
      )}
    </React.Fragment>
  );
};

export default TriggerInputField;
