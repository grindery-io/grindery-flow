import React from "react";
import styled from "styled-components";
import { AutoCompleteInput } from "grindery-ui";
import { BLOCKCHAINS } from "../../constants";

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
};

const ChainSelector = (props: Props) => {
  const { onChange, value } = props;

  const options = BLOCKCHAINS;

  return (
    <InputWrapper>
      <AutoCompleteInput
        label="Blockchain"
        size="full"
        placeholder="Select a blockchain"
        onChange={onChange}
        options={options}
        value={value}
        required
      />
    </InputWrapper>
  );
};

export default ChainSelector;
