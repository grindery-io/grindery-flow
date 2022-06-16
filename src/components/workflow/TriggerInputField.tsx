import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { debounce } from "throttle-debounce";
import { SelectInput, InputBox } from "grindery-ui";
import { Field } from "../../types/Connector";
import { formatWorkflow, jsonrpcObj } from "../../utils";
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
  loading: boolean;
  setLoading: (a: boolean) => void;
};

const TriggerInputField = ({ inputField, loading, setLoading }: Props) => {
  const {
    trigger,
    triggerConnector,
    workflow,
    updateWorkflow,
    setConnectors,
    connectors,
  } = useWorkflowContext();
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
    setLoading(true);
    setVal(
      (inputField.type === "string" || inputField.type === "number") &&
        !fieldOptions
        ? e?.target.value === 0
          ? 0
          : e?.target.value || ""
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
                setConnectors?.([
                  ...(connectors || []).map((connector) => {
                    if (connector && connector.key === triggerConnector?.key) {
                      return {
                        ...connector,
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (trig.key === trigger.key && trig.operation) {
                              return {
                                ...trig,
                                operation: {
                                  ...trig.operation,
                                  inputFields:
                                    res.data.result.inputFields ||
                                    trig.operation.inputFields,
                                  outputFields:
                                    res.data.result.outputFields ||
                                    trig.operation.outputFields ||
                                    [],
                                  sample:
                                    res.data.result.sample ||
                                    trig.operation.sample ||
                                    {},
                                },
                              };
                            } else {
                              return trig;
                            }
                          }),
                        ],
                      };
                    } else {
                      return connector;
                    }
                  }),
                ]);
              }
              setLoading(false);
            })
            .catch((err) => {
              console.log("grinderyNexusConnectorUpdateFields error", err);
              setLoading(false);
            });
        }
      } else {
        setLoading(false);
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
      newVal = val?.value === 0 ? 0 : val?.value || "";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valChanged, updateFieldsDefinition]);

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && (
        <InputWrapper>
          {(inputField.type === "number" ||
            (inputField.type === "string" && !inputField.choices)) && (
            <InputBox
              value={val || ""}
              label={inputField.label || ""}
              placeholder={inputField.placeholder || ""}
              tooltip={inputField.helpText}
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
              tooltip={inputField.helpText}
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
              tooltip={inputField.helpText}
              required={!!inputField.required}
            />
          )}
        </InputWrapper>
      )}
    </React.Fragment>
  );
};

export default TriggerInputField;
