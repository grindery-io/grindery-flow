import React from "react";
import styled from "styled-components";
import { InputSuffix } from "grindery-ui";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const Label = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin-right: 6px;
`;

const InputWrapper = styled.div`
  margin-left: auto;
  max-width: 92px;

  & .MuiTextField-root {
    background: #fff !important;
  }
`;

type Props = {
  value: string;
  onChange: (a: any) => void;
  suffix?: string;
  placeholder?: string;
};

const GasInput = (props: Props) => {
  const { value, onChange, suffix, placeholder } = props;
  return (
    <Wrapper>
      <Label>Set gas limit for this action:</Label>
      <InputWrapper>
        <InputSuffix
          value={value}
          onChange={onChange}
          suffix={suffix || "ETH"}
          placeholder={placeholder || ""}
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default GasInput;
