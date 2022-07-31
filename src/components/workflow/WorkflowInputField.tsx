import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  IconButton,
  RichInput,
  SelectInput,
  AutoCompleteInput,
} from "grindery-ui";
import { Field } from "../../types/Connector";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import { BLOCKCHAINS, ICONS } from "../../constants";
import { debounce } from "throttle-debounce";
import axios from "axios";
import { jsonrpcObj } from "../../helpers/utils";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
  & > *:first-child {
    flex: 1;
  }
  & > .MuiBox-root > .MuiBox-root {
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

const IconButtonWrapper = styled.div`
  margin-top: 42px;

  & .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }
`;

type Props = {
  type: "action" | "trigger";
  inputField: Field;
  options?: any;
  index?: any;
  addressBook: any;
  setAddressBook?: (i: any) => void;
  setError: (i: string) => void;
  errors: any;
  setErrors: (a: any) => void;
};

const WorkflowInputField = ({
  type,
  inputField,
  options,
  index,
  addressBook,
  setAddressBook,
  setError,
  errors,
  setErrors,
}: Props) => {
  const { user } = useAppContext();
  const {
    updateWorkflow,
    workflow,
    actions,
    triggers,
    setConnectors,
    connectors,
    setLoading,
  } = useWorkflowContext();

  const operation =
    type === "trigger" ? triggers.current : actions.current(index);

  const workflowStep =
    type === "trigger" ? workflow.trigger : workflow.actions[index];

  const currentConnector =
    type === "trigger"
      ? triggers.triggerConnector
      : actions.actionConnector(index);

  const [valChanged, setValChanged] = useState(false);

  const fieldOptions = inputField.choices?.map((choice) => ({
    value: typeof choice !== "string" ? choice.value : choice,
    label: typeof choice !== "string" ? choice.label : choice,
    icon: currentConnector ? currentConnector.icon || "" : "",
  }));

  const booleanOptions = [
    {
      value: "true",
      label: "True",
      icon: "",
    },
    { value: "false", label: "False", icon: "" },
  ];

  const workflowInputValue =
    type === "trigger"
      ? workflow.trigger.input[inputField.key]
      : workflow.actions[index].input[inputField.key];

  const workflowValue = inputField.list
    ? workflowInputValue || [""]
    : (workflowInputValue || inputField.default || "").toString();

  const [valuesNum, setValuesNum] = useState(
    Array.isArray(workflowValue) && workflowValue.length > 1
      ? [
          ...workflowValue
            .slice(1)
            .filter((e) => e !== "" && typeof e !== "undefined")
            .map((e, i) => i + 1),
        ]
      : []
  );

  const error =
    (errors &&
      typeof errors !== "boolean" &&
      errors.length > 0 &&
      errors.find((error: any) => error && error.field === inputField.key) &&
      (
        errors.find((error: any) => error && error.field === inputField.key)
          .message || ""
      ).replace(`'${inputField.key}'`, "")) ||
    false;

  const handleFieldChange = (value: string, idx?: number) => {
    setError("");
    setErrors(
      typeof errors !== "boolean"
        ? [
            ...errors.filter(
              (error: any) => error && error.field !== inputField.key
            ),
          ]
        : errors
    );

    let newVal: string | number | boolean | (string | number | boolean)[] =
      value.trim();
    if (
      (inputField.type === "string" && inputField.choices) ||
      inputField.type === "boolean"
    ) {
      newVal = (value || "").trim();
      if (inputField.type === "boolean") {
        newVal = newVal === "true";
      }
    }
    if (inputField.type === "string" && !fieldOptions) {
      newVal = value.trim();
    }
    if (inputField.type === "number" && !fieldOptions) {
      newVal = value ? parseFloat(value) : "";
    }
    /*if (inputField.list) {
      newVal = [newVal].filter((val) => val);
    }*/

    const key =
      (type === "trigger"
        ? "trigger.input." + inputField.key
        : "actions[" + index + "].input." + inputField.key) +
      (inputField.list && typeof idx !== "undefined" ? "[" + idx + "]" : "");
    updateWorkflow({
      [key]: newVal || (typeof idx !== "undefined" ? undefined : ""),
    });
    setValChanged(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFieldsDefinition = useCallback(
    debounce(1000, () => {
      if (
        (typeof inputField.updateFieldDefinition === "undefined" ||
          inputField.updateFieldDefinition) &&
        operation?.operation?.inputFieldProviderUrl
      ) {
        if (workflow) {
          axios
            .post(
              operation?.operation?.inputFieldProviderUrl || "",
              jsonrpcObj("grinderyNexusConnectorUpdateFields", {
                key: operation?.key,
                fieldData: workflowStep.input,
                credentials: workflowStep.credentials,
              })
            )
            .then((res) => {
              if (res && res.data && res.data.error) {
                console.error(
                  "grinderyNexusConnectorUpdateFields error",
                  res.data.error
                );
              }
              if (res && res.data && res.data.result) {
                setConnectors([
                  ...(connectors || []).map((connector) => {
                    if (connector && connector.key === currentConnector?.key) {
                      return {
                        ...connector,
                        actions: [
                          ...(connector.actions || []).map((act) => {
                            if (
                              act.key === operation?.key &&
                              act.operation &&
                              type === "action"
                            ) {
                              return {
                                ...act,
                                operation: {
                                  ...act.operation,
                                  inputFields:
                                    res.data.result.inputFields ||
                                    act.operation.inputFields,
                                  outputFields:
                                    res.data.result.outputFields ||
                                    act.operation.outputFields ||
                                    [],
                                  sample:
                                    res.data.result.sample ||
                                    act.operation.sample ||
                                    {},
                                },
                              };
                            } else {
                              return act;
                            }
                          }),
                        ],
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (
                              trig.key === operation?.key &&
                              trig.operation &&
                              type === "trigger"
                            ) {
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
              console.error("grinderyNexusConnectorUpdateFields error", err);
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

  const renderField = (field: Field, idx?: number) => {
    const v =
      typeof idx !== "undefined" && Array.isArray(workflowValue)
        ? workflowValue[idx]
        : workflowValue;
    const commonProps = {
      placeholder: field.placeholder || "",
      onChange: (v: string) => {
        handleFieldChange(v, idx);
      },
      label: field.label || "",
      required: !!field.required,
      tooltip: field.helpText || false,
      error: !field.list ? error : !v ? error : false,
      value: v,
    };

    switch (field.type) {
      case "boolean":
        return (
          <SelectInput
            {...commonProps}
            type="default"
            options={booleanOptions}
          />
        );
      default:
        return field.choices ? (
          <AutoCompleteInput
            {...commonProps}
            size="full"
            options={fieldOptions}
          />
        ) : field.key === "_grinderyChain" ? (
          <AutoCompleteInput
            {...commonProps}
            size="full"
            options={BLOCKCHAINS}
          />
        ) : (
          <RichInput
            {...commonProps}
            options={options || []}
            user={user}
            hasAddressBook={field.type === "address"}
            addressBook={addressBook}
            setAddressBook={setAddressBook}
          />
        );
    }
  };

  useEffect(() => {
    if (valChanged) {
      if (
        (typeof inputField.updateFieldDefinition === "undefined" ||
          inputField.updateFieldDefinition) &&
        operation?.operation?.inputFieldProviderUrl
      ) {
        setLoading(true);
        updateFieldsDefinition();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    valChanged,
    updateFieldsDefinition,
    setLoading,
    inputField.updateFieldDefinition,
  ]);

  useEffect(() => {
    if (inputField && inputField.default) {
      handleFieldChange(inputField.default);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputField]);

  return (
    <React.Fragment key={inputField.key}>
      {!!inputField && (
        <>
          <InputWrapper>
            {renderField(inputField, inputField.list ? 0 : undefined)}
            {inputField.list && (
              <IconButtonWrapper>
                <IconButton
                  icon={ICONS.PLUS}
                  onClick={() => {
                    setValuesNum((currentValuesNum) => [
                      ...currentValuesNum,
                      (currentValuesNum[currentValuesNum.length - 1] || 0) + 1,
                    ]);
                  }}
                />
              </IconButtonWrapper>
            )}
          </InputWrapper>
          {valuesNum.length > 0 &&
            inputField.list &&
            valuesNum.map((idx, i) => (
              <InputWrapper key={idx.toString()} style={{ marginTop: "0px" }}>
                {renderField(
                  { ...inputField, key: inputField.key + "_" + (i + 1) },
                  inputField.list ? i + 1 : undefined
                )}
                <IconButtonWrapper>
                  <IconButton
                    icon={ICONS.TRASH}
                    onClick={() => {
                      if (Array.isArray(workflowValue)) {
                        const curVal = [...workflowValue];
                        curVal.splice(i + 1, 1);
                        const key =
                          type === "trigger"
                            ? "trigger.input." + inputField.key
                            : "actions[" + index + "].input." + inputField.key;
                        updateWorkflow({
                          [key]: curVal,
                        });
                      }
                      setValChanged(true);
                      setValuesNum((currentValuesNum) => [
                        ...currentValuesNum.filter((i2) => i2 !== idx),
                      ]);
                    }}
                  />
                </IconButtonWrapper>
              </InputWrapper>
            ))}
        </>
      )}
    </React.Fragment>
  );
};

export default WorkflowInputField;
