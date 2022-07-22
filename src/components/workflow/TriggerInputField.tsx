import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { debounce } from "throttle-debounce";
import { RichInput, SelectInput, AutoCompleteInput } from "grindery-ui";
import { Field } from "../../types/Connector";
import { jsonrpcObj } from "../../helpers/utils";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import { BLOCKCHAINS } from "../../constants";
import InputFieldError from "../shared/InputFieldError";

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
  setTriggerError: (i: string) => void;
  addressBook: any;
  setAddressBook?: (i: any) => void;
  errors: any;
  setErrors: (a: any) => void;
};

const TriggerInputField = ({
  inputField,
  setTriggerError,
  addressBook,
  setAddressBook,
  errors,
  setErrors,
}: Props) => {
  const {
    workflow,
    updateWorkflow,
    setConnectors,
    connectors,
    setLoading,
    triggers,
  } = useWorkflowContext();
  const [valChanged, setValChanged] = useState(false);
  const { user } = useAppContext();

  const fieldOptions = inputField.choices?.map((choice) => ({
    value: typeof choice !== "string" ? choice.value : choice,
    label: typeof choice !== "string" ? choice.label : choice,
    icon: triggers.triggerConnector ? triggers.triggerConnector.icon || "" : "",
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
    typeof workflow.trigger.input[inputField.key] !== "undefined"
      ? workflow.trigger.input[inputField.key]
      : inputField.default || ""
  ).toString();

  console.log(inputField.key, workflowValue);

  const handleFieldChange = (value: string) => {
    setTriggerError("");
    setErrors(
      typeof errors !== "boolean"
        ? [
            ...errors.filter(
              (error: any) => error && error.field !== inputField.key
            ),
          ]
        : errors
    );

    let newVal: string | number | boolean | (string | number | boolean)[] = (
      value || ""
    ).trim();
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
    if (inputField.list) {
      newVal = [newVal].filter((val) => val);
    }
    updateWorkflow({
      ["trigger.input." + inputField.key]: newVal,
    });
    setValChanged(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFieldsDefinition = useCallback(
    debounce(1000, () => {
      if (
        (typeof inputField.updateFieldDefinition === "undefined" ||
          inputField.updateFieldDefinition) &&
        triggers.current?.operation?.inputFieldProviderUrl
      ) {
        if (workflow) {
          axios
            .post(
              triggers.current.operation.inputFieldProviderUrl,
              jsonrpcObj("grinderyNexusConnectorUpdateFields", {
                key: triggers.current.key,
                fieldData: workflow.trigger.input,
                credentials: workflow.trigger.credentials,
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
                setConnectors([
                  ...(connectors || []).map((connector) => {
                    if (
                      connector &&
                      connector.key === triggers.triggerConnector?.key
                    ) {
                      return {
                        ...connector,
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (
                              trig.key === triggers.current?.key &&
                              trig.operation
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
      case "number":
        return (
          <RichInput
            value={workflowValue}
            label={inputField.label || ""}
            placeholder={inputField.placeholder || ""}
            tooltip={inputField.helpText}
            required={!!inputField.required}
            onChange={handleFieldChange}
            user={user}
            hasAddressBook={inputField.type === "address"}
            options={[]}
            addressBook={addressBook}
            setAddressBook={setAddressBook}
          ></RichInput>
        );
      default:
        return !inputField.choices ? (
          inputField.key === "_grinderyChain" ? (
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
              value={workflowValue}
              label={inputField.label || ""}
              placeholder={inputField.placeholder || ""}
              tooltip={inputField.helpText}
              required={!!inputField.required}
              onChange={handleFieldChange}
              user={user}
              hasAddressBook={inputField.type === "address"}
              options={[]}
              addressBook={addressBook}
              setAddressBook={setAddressBook}
            ></RichInput>
          )
        ) : (
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
        );
    }
  };

  useEffect(() => {
    if (valChanged) {
      if (
        (typeof inputField.updateFieldDefinition === "undefined" ||
          inputField.updateFieldDefinition) &&
        triggers.current?.operation?.inputFieldProviderUrl
      ) {
        setLoading(true);
        updateFieldsDefinition();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    valChanged,
    updateFieldsDefinition,
    inputField.updateFieldDefinition,
    setLoading,
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
        <InputWrapper>
          {renderField(inputField)}
          {errors &&
            typeof errors !== "boolean" &&
            errors.length > 0 &&
            errors.find(
              (error: any) => error && error.field === inputField.key
            ) && (
              <InputFieldError>
                {(
                  errors.find(
                    (error: any) => error && error.field === inputField.key
                  ).message || ""
                ).replace(`'${inputField.key}'`, "")}
              </InputFieldError>
            )}
        </InputWrapper>
      )}
    </React.Fragment>
  );
};

export default TriggerInputField;
