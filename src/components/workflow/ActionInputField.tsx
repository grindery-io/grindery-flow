import React, { useEffect, useState } from "react";
import { AutoCompleteInput } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import { Field } from "../../types/Connector";

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
          .split("{{;}}")
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
      ? val.map((v) => (v.value ? v.value : v)).join("{{;}}")
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
        <div
          style={{
            width: "100%",
            marginTop: 20,
          }}
        >
          <AutoCompleteInput
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
