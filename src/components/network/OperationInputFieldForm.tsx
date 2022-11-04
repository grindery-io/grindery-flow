import React, { useState } from "react";
import styled from "styled-components";
import { Autocomplete, RichInput } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";
import { useNavigate, useParams } from "react-router";
import CheckBox from "../shared/CheckBox";

const Container = styled.div`
  & [data-slate-editor="true"][contenteditable="false"] {
    cursor: not-allowed;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-itmes: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 12px;
  margin: 20px 0;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const CheckboxLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
  cursor: pointer;
`;

type Props = {};

const OperationInputFieldForm = (props: Props) => {
  let { id, type, key, inputKey } = useParams();
  let navigate = useNavigate();
  const { state, onInputFieldSave } = useConnectorContext();
  const [error, setError] = useState({ type: "", text: "" });
  const inputField: any = (
    (type &&
      state.cds?.[type]?.find((op: any) => op.key === key)?.operation
        ?.inputFields) ||
    []
  ).find((input: any) => input.key === inputKey);
  const [data, setData] = useState<any>({
    key: inputField?.key || "",
    label: inputField?.label || "",
    helpText: inputField?.helpText || "",
    default: inputField?.default || "",
    required: !!inputField?.required,
    computed: !!inputField?.computed,
    type: inputField?.type || "string",
  });

  const typeOptions = [
    { value: "string", label: "String" },
    { value: "text", label: "Text" },
    { value: "integer", label: "Integer" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "datetime", label: "Datetime" },
    { value: "file", label: "File" },
    { value: "password", label: "Password" },
    { value: "copy", label: "Copy" },
    { value: "code", label: "Code" },
    { value: "address", label: "Blockchain address" },
    { value: "email", label: "Email" },
    { value: "luhn", label: "Luhn" },
    { value: "mac", label: "Mac address" },
    { value: "url", label: "URL address" },
    { value: "uuid", label: "UUID" },
    { value: "evmAddress", label: "EVM blockchain address" },
    { value: "flowAddress", label: "Flow blckchain address" },
  ];

  return (
    <Container>
      <RichInput
        value={data.key || ""}
        label="Key"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, key: value });
        }}
        required
        placeholder="field_key"
        singleLine
        tooltip="Enter the word or phrase your Connector uses to reference this field or parameter. Not seen by users. Example: first_name"
        readonly={inputKey !== "__new__"}
        error={error.type === "key" ? error.text : ""}
      />
      <RichInput
        value={data.label || ""}
        label="Label"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, label: value });
        }}
        required
        placeholder="Field Label"
        singleLine
        tooltip="Enter a user friendly name for this field that describes what to enter. Shown to users inside Nexus. Example: First Name"
        error={error.type === "label" ? error.text : ""}
      />
      <RichInput
        value={data.helpText || ""}
        label="Help Text"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, helpText: value });
        }}
        placeholder="Enter help text here"
        tooltip="Describe clearly the purpose of this field in a complete sentence with at least 20 characters. Example: Filter by first name."
        error={error.type === "helpText" ? error.text : ""}
      />

      <Autocomplete
        placeholder="Select field type"
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, type: value });
        }}
        label="Field type"
        required
        tooltip="See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#fieldschema"
        value={data.type || ""}
        size="full"
        options={typeOptions}
        error={error.type === "type" ? error.text : ""}
      />

      <RichInput
        value={data.default || ""}
        label="Default Text"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, default: value });
        }}
        placeholder=""
        singleLine
        tooltip="If most users need the same option, add default text that Nexus will save when the workflow is created if the user leaves it blank."
        error={error.type === "default" ? error.text : ""}
      />
      <CheckboxWrapper>
        <CheckBox
          isNetwork
          checked={data.required}
          onChange={() => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              required: !data.required,
            });
          }}
        />
        <CheckboxLabel
          onClick={() => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              required: !data.required,
            });
          }}
        >
          Required
        </CheckboxLabel>
      </CheckboxWrapper>
      <CheckboxWrapper>
        <CheckBox
          isNetwork
          checked={data.computed}
          onChange={() => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              computed: !data.computed,
            });
          }}
        />
        <CheckboxLabel
          onClick={() => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              computed: !data.computed,
            });
          }}
        >
          Hidden
        </CheckboxLabel>
      </CheckboxWrapper>
      <ButtonsWrapper>
        <Button
          style={{
            padding: "7px 24px",
            background: "none",
            border: "1px solid #0b0d17",
          }}
          onClick={() => {
            navigate(`/network/connector/${id}/${type}/${key}/inputFields`);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setError({ type: "", text: "" });
            if (!data.type) {
              setError({ type: "type", text: "Field type is required" });
              return;
            }
            if (!data.key) {
              setError({ type: "key", text: "Field key is required" });
              return;
            }
            if (!data.label) {
              setError({ type: "label", text: "Field label is required" });
              return;
            }
            onInputFieldSave(key || "", type, inputKey || "", data);
          }}
        >
          Save
        </Button>
      </ButtonsWrapper>
    </Container>
  );
};

export default OperationInputFieldForm;
