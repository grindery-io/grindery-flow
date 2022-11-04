import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";

const Container = styled.div`
  margin-top: 20px;

  & [data-slate-editor="true"][contenteditable="false"] {
    cursor: not-allowed;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 32px;
`;

const ButtonsRight = styled.div`
  margin-left: auto;
`;

type Props = {};

const OperationSettings = (props: Props) => {
  let { key, type } = useParams();
  const { state, onOperationSettingsSave } = useConnectorContext();
  const [error, setError] = useState({ type: "", text: "" });
  const isNewOperation = key === "__new__";
  const [currentKey, setCurrentKey] = useState(key);
  const { cds } = state;
  const currentOperation =
    (type && cds?.[type]?.find((op: any) => op.key === key)) || null;
  const [operation, setOperation] = useState<any>({
    key: currentOperation?.key || "",
    name: currentOperation?.name || "",
    display: {
      label: currentOperation?.display?.label || "",
      description: currentOperation?.display?.description || "",
    },
    operation: currentOperation?.operation || {
      inputFields: [],
    },
  });

  useEffect(() => {
    const _currentOperation = {
      ...((type && cds?.[type]?.find((op: any) => op.key === key)) || {}),
    };
    setOperation({
      key: _currentOperation?.key || "",
      name: _currentOperation?.name || "",
      display: {
        label: _currentOperation?.display?.label || "",
        description: _currentOperation?.display?.description || "",
      },
      operation: _currentOperation?.operation || {
        inputFields: [],
      },
    });
    setCurrentKey(key);
  }, [currentOperation, key, type, cds]);

  return (
    <Container>
      <RichInput
        key={`${currentKey}_key`}
        label="Key"
        value={operation.key}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            key: value,
          });
        }}
        singleLine
        required
        tooltip="Enter a unique word or phrase without spaces to reference this operation inside Nexus. Not seen by users. Example: new_ticket."
        options={[]}
        readonly={!isNewOperation}
        error={error.type === "key" ? error.text : ""}
      />
      <RichInput
        key={`${currentKey}_name`}
        label="Name"
        value={operation.name}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            name: value,
            display: {
              ...operation.display,
              label: value,
            },
          });
        }}
        singleLine
        required
        tooltip="Enter a user friendly name for this operation that describes what makes it run. Shown to users inside Nexus. Example: New Ticket."
        options={[]}
        error={error.type === "name" ? error.text : ""}
      />
      <RichInput
        key={`${currentKey}_description`}
        label="Description"
        value={operation.display?.description || ""}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            display: {
              ...operation.display,
              description: value,
            },
          });
        }}
        required
        tooltip="Describe clearly the purpose of this operation in a complete sentence. Example: Triggers when a new support ticket is created."
        options={[]}
        error={error.type === "description" ? error.text : ""}
      />

      <ButtonsWrapper>
        <ButtonsRight>
          <Button
            onClick={() => {
              setError({ type: "", text: "" });
              if (!operation.key) {
                setError({
                  type: "key",
                  text: "Key field is required",
                });
                return;
              }
              if (!operation.name) {
                setError({
                  type: "name",
                  text: "Name field is required",
                });
                return;
              }
              if (!operation.display?.description) {
                setError({
                  type: "description",
                  text: "Description field is required",
                });
                return;
              }
              onOperationSettingsSave(type, operation);
            }}
          >
            Save
          </Button>
        </ButtonsRight>
      </ButtonsWrapper>
    </Container>
  );
};

export default OperationSettings;
