import React from "react";
import styled from "styled-components";
import { AutoCompleteInput } from "grindery-ui";
import { ICONS } from "../../constants";

const options = [
  {
    value: "eip155:1",
    label: "Ethereum",
    icon: ICONS.CHAIN_ETHEREUM,
  },
  {
    value: "eip155:42161",
    label: "Arbitrum",
    icon: ICONS.CHAIN_ARBITRUM,
  },
  {
    value: "eip155:100",
    label: "Gnosis Chain",
    icon: ICONS.CHAIN_GNOSIS,
  },
  {
    value: "eip155:137",
    label: "Polygon",
    icon: ICONS.CHAIN_POLYGON,
  },
  {
    value: "eip155:42220",
    label: "Celo",
    icon: ICONS.CHAIN_CELO,
  },
];

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
  value: any;
};

const ChainSelector = (props: Props) => {
  const { onChange, value } = props;

  const val = options.find((opt) => opt.value === value);

  return (
    <InputWrapper>
      <AutoCompleteInput
        label="Blockchain"
        size="full"
        placeholder="Select a blockchain"
        onChange={onChange}
        options={options}
        value={val ? [val] : []}
        required
      />
    </InputWrapper>
  );
};

export default ChainSelector;
