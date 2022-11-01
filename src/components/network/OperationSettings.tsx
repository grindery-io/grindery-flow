import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";

const Container = styled.div`
  margin-top: 20px;
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
  const { state } = useConnectorContext();
  const { cds } = state;
  const operation =
    (type && cds?.[type].find((op: any) => op.key === key)) || null;

  return (
    <Container>
      <RichInput
        key={`${key}_key`}
        label="Key"
        value={operation.key}
        onChange={() => {}}
        singleLine
        required
        tooltip="Enter a unique word or phrase without spaces to reference this operation inside Nexus. Not seen by users. Example: new_ticket."
        options={[]}
      />
      <RichInput
        key={`${key}_name`}
        label="Name"
        value={operation.name}
        onChange={() => {}}
        singleLine
        required
        tooltip="Enter a user friendly name for this operation that describes what makes it run. Shown to users inside Nexus. Example: New Ticket."
        options={[]}
      />
      <RichInput
        key={`${key}_description`}
        label="Description"
        value={operation.display?.description || ""}
        onChange={() => {}}
        required
        tooltip="Describe clearly the purpose of this operation in a complete sentence. Example: Triggers when a new support ticket is created."
        options={[]}
      />

      <ButtonsWrapper>
        <ButtonsRight>
          <Button
            onClick={() => {
              alert("Not implemented yet");
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
