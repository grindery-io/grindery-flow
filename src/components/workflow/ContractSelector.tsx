import React from "react";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";

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
  onChange: (a: any) => void;
  value: string;
  options?: any[];
  addressBook: any[];
  setAddressBook: (i: any) => void;
};

const ContractSelector = (props: Props) => {
  const { user } = useAppContext();
  const { onChange, value, options, addressBook, setAddressBook } = props;

  return (
    <InputWrapper>
      <RichInput
        label="Contract address"
        placeholder="Enter contract address"
        required
        //tooltip={inputField.helpText || false}
        options={options}
        onChange={onChange}
        value={value}
        user={user}
        hasAddressBook
        addressBook={addressBook}
        setAddressBook={setAddressBook}
      />
    </InputWrapper>
  );
};

export default ContractSelector;
