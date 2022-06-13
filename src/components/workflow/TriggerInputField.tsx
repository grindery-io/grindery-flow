import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { debounce } from "throttle-debounce";
import { SelectInput, InputBox } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import { Field } from "../../types/Connector";
import axios from "axios";
import { formatWorkflow, jsonrpcObj } from "../../utils";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

type Props = {
  inputField: Field;
  loading: boolean;
  setLoading: (a: boolean) => void;
};

const TriggerInputField = ({ inputField, loading, setLoading }: Props) => {
  const { trigger, triggerConnector, workflow, updateWorkflow } =
    useAppContext();
  const [valChanged, setValChanged] = useState(false);

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

  const workflowValue =
    typeof workflow?.trigger.input[inputField.key] !== "undefined"
      ? workflow?.trigger.input[inputField.key]
      : inputField.default || "";

  const [val, setVal]: any = useState(
    fieldOptions
      ? fieldOptions?.find(
          (opt) =>
            opt.value === (workflowValue && workflowValue.toString()) || ""
        ) || []
      : inputField.type === "boolean"
      ? workflowValue
        ? booleanOptions[0]
        : booleanOptions[1]
      : (workflowValue && workflowValue.toString()) || ""
  );

  const handleFieldChange = (e: any) => {
    setVal(
      (inputField.type === "string" || inputField.type === "number") &&
        !fieldOptions
        ? e?.target.value || ""
        : e
    );
    setValChanged(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFieldsDefinition = useCallback(
    debounce(1000, () => {
      if (
        (typeof inputField.updateFieldDefinition === "undefined" ||
          inputField.updateFieldDefinition) &&
        trigger.operation.inputFieldProviderUrl
      ) {
        if (workflow) {
          setLoading(true);
          const formattedWorkflow = formatWorkflow(workflow);
          axios
            .post(
              trigger.operation.inputFieldProviderUrl,
              jsonrpcObj("grinderyNexusConnectorUpdateFields", {
                key: trigger.key,
                fieldData: formattedWorkflow?.trigger.input,
                credentials: formattedWorkflow?.trigger.credentials,
              })
            )
            .then((res) => {
              if (res && res.data && res.data.error) {
                console.log(
                  "grinderyNexusConnectorUpdateFields error",
                  res.data.error
                );
              }
              if (res && res.data && res.data.result) {
                console.log(
                  "grinderyNexusConnectorUpdateFields data",
                  res.data.result
                );
                if (res.data.result.inputFields) {
                  (
                    triggerConnector?.triggers?.find(
                      (connectorTrigger: { key: any }) =>
                        connectorTrigger &&
                        connectorTrigger.key === workflow.trigger.operation
                    ) || {}
                  ).operation = res.data.result.inputFields;
                }
              }
              setLoading(false);
            })
            .catch((err) => {
              console.log("grinderyNexusConnectorUpdateFields error", err);
              setLoading(false);
            });
        }
      }
      setValChanged(false);
    }),
    []
  );

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

  useEffect(() => {
    if (valChanged) {
      updateFieldsDefinition();
    }
  }, [valChanged, updateFieldsDefinition]);

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
