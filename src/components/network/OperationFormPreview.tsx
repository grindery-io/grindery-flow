import React, { useState } from "react";
import { useParams } from "react-router";
import { RichInput, Autocomplete } from "grindery-ui";
import styled from "styled-components";
import { BLOCKCHAINS, ICONS } from "../../constants";
import useConnectorContext from "../../hooks/useConnectorContext";
import useAddressBook from "../../hooks/useAddressBook";
import useAppContext from "../../hooks/useAppContext";

const Container = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border-left: 1px solid #dcdcdc;
  padding-left: 20px;

  & h3 {
    margin: 0;
    padding: 0;
  }

  & h4 {
    margin: 0;
    padding: 4px 8px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    text-transform: uppercase;
    font-size: 12px;
    color: #898989;
  }
`;

const IconWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;

  & img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  & > .MuiBox-root > .MuiBox-root {
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

type Props = {};

const OperationFormPreview = (props: Props) => {
  const { type, key } = useParams();
  const { user } = useAppContext();
  const { state } = useConnectorContext();
  const [chain, setChain] = useState("");
  const { cds } = state;
  const { addressBook, setAddressBook } = useAddressBook(user);
  const operation =
    (type && cds?.[type]?.find((op: any) => op.key === key)?.operation) || {};
  const inputFields = operation?.inputFields || [];

  const chains = BLOCKCHAINS;

  return (
    <Container>
      <h4>Workflow editor preview</h4>
      <IconWrapper>
        <img src={cds.icon || ICONS.NEXUS_SQUARE} alt="" />
      </IconWrapper>
      <div>
        <h3>Set up {type === "triggers" ? "trigger" : "action"}</h3>
      </div>
      <div style={{ width: "100%" }}>
        {(operation?.type === "blockchain:event" ||
          operation?.type === "blockchain:call") &&
          inputFields.filter(
            (inputfield: any) => inputfield.key === "_grinderyChain"
          ).length < 1 && (
            <InputWrapper>
              <Autocomplete
                label="Blockchain"
                size="full"
                placeholder="Select a blockchain"
                onChange={(value: string) => {
                  setChain(value);
                }}
                options={chains}
                value={chain}
                required
              />
            </InputWrapper>
          )}

        {(operation?.type === "blockchain:event" ||
          operation?.type === "blockchain:call") &&
          inputFields.filter(
            (inputfield: any) => inputfield.key === "_grinderyContractAddress"
          ).length < 1 && (
            <InputWrapper>
              <RichInput
                label="Contract address"
                placeholder="Enter contract address"
                required
                options={[]}
                onChange={() => {}}
                value={""}
                user={user}
                hasAddressBook
                addressBook={addressBook}
                setAddressBook={setAddressBook}
              />
            </InputWrapper>
          )}
        {inputFields &&
          inputFields.length > 0 &&
          inputFields.map((field: any) => (
            <RichInput
              label={field.label || field.key || ""}
              key={field.key}
              value={field.default || ""}
              onChange={() => {}}
              options={[]}
              required={field.required}
              tooltip={field.helpText || ""}
            />
          ))}
      </div>
    </Container>
  );
};

export default OperationFormPreview;
