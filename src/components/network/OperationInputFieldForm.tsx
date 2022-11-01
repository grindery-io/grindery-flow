import React, { useState } from "react";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
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

type Props = {
  onSubmit: (a: string, b: any) => void;
};

const OperationInputFieldForm = (props: Props) => {
  const { onSubmit } = props;
  let { id, type, key, inputKey } = useParams();
  let navigate = useNavigate();
  const { state } = useConnectorContext();
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
  });

  return (
    <Container>
      <RichInput
        value={data.key || ""}
        label="Key"
        options={[]}
        onChange={(value: string) => {
          setData({ ...data, key: value });
        }}
        required
        placeholder="field_key"
        singleLine
        tooltip="Enter the word or phrase your Connector uses to reference this field or parameter. Not seen by users. Example: first_name"
        readonly={inputKey !== "__new__"}
      />
      <RichInput
        value={data.label || ""}
        label="Label"
        options={[]}
        onChange={(value: string) => {
          setData({ ...data, label: value });
        }}
        required
        placeholder="Field Label"
        singleLine
        tooltip="Enter a user friendly name for this field that describes what to enter. Shown to users inside Nexus. Example: First Name"
      />
      <RichInput
        value={data.helpText || ""}
        label="Help Text"
        options={[]}
        onChange={(value: string) => {
          setData({ ...data, helpText: value });
        }}
        placeholder="Enter help text here"
        tooltip="Describe clearly the purpose of this field in a complete sentence with at least 20 characters. Example: Filter by first name."
      />
      <RichInput
        value={data.default || ""}
        label="Default Text"
        options={[]}
        onChange={(value: string) => {
          setData({ ...data, default: value });
        }}
        placeholder=""
        singleLine
        tooltip="If most users need the same option, add default text that Nexus will save when the workflow is created if the user leaves it blank."
      />
      <CheckboxWrapper>
        <CheckBox
          isNetwork
          checked={data.required}
          onChange={() => {
            setData({
              ...data,
              required: !data.required,
            });
          }}
        />
        <CheckboxLabel
          onClick={() => {
            setData({
              ...data,
              required: !data.required,
            });
          }}
        >
          Required
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
            onSubmit(inputKey || "__new__", data);
          }}
        >
          Save
        </Button>
      </ButtonsWrapper>
    </Container>
  );
};

export default OperationInputFieldForm;
