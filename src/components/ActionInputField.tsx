import React, { useState } from "react";
import { SelectInput } from "grindery-ui";
import { useAppContext } from "../context/AppContext";
import { Field } from "../types/Connector";

type Props = {
  inputField: Field;
  options: any;
  index: any;
};

const ActionInputField = ({ inputField, options, index }: Props) => {
  const { updateWorkflow, workflow } = useAppContext();
  const workflowValue = workflow?.actions[index].input[inputField.key];
  const [val, setVal]: any = useState(
    workflowValue
      ? workflowValue
          ?.toString()
          .split(" ")
          .map((v) => options.find((o: any) => o.value === v))
      : []
  );

  const handleFieldChange = (value: any) => {
    setVal(Array.isArray(value) ? value : [value]);

    const wfValue = Array.isArray(value)
      ? value.map((v) => v.value).join(" ")
      : value.value;

    updateWorkflow?.({
      ["actions[" + index + "].input." + inputField.key]: wfValue || "",
    });
  };

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && (
        <div
          style={{
            width: "100%",
            marginTop: 20,
          }}
        >
          <SelectInput
            label={inputField.label || ""}
            type="searchLabel"
            variant="full"
            placeholder={inputField.placeholder || ""}
            required={!!inputField.required}
            texthelper={inputField.helpText || ""}
            options={options}
            onChange={handleFieldChange}
            value={val}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ActionInputField;
