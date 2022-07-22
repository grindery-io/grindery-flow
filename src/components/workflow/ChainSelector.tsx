import React from "react";
import styled from "styled-components";
import { AutoCompleteInput } from "grindery-ui";
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
  onChange: (a: any) => void;
  value: string;
  errors?: any;
  setErrors?: (a: any) => void;
};

const ChainSelector = (props: Props) => {
  const { onChange, value, errors, setErrors } = props;

  const options = BLOCKCHAINS;

  const handleChange = (value: any) => {
    if (setErrors) {
      setErrors(
        typeof errors !== "boolean"
          ? [
              ...errors.filter(
                (error: any) => error && error.field !== "_grinderyChain"
              ),
            ]
          : errors
      );
    }

    onChange(value);
  };

  return (
    <InputWrapper>
      <AutoCompleteInput
        label="Blockchain"
        size="full"
        placeholder="Select a blockchain"
        onChange={handleChange}
        options={options}
        value={value}
        required
      />
      {errors &&
        typeof errors !== "boolean" &&
        errors.length > 0 &&
        errors.find(
          (error: any) => error && error.field === "_grinderyChain"
        ) && (
          <InputFieldError>
            {(
              errors.find(
                (error: any) => error && error.field === "_grinderyChain"
              ).message || ""
            ).replace(`'_grinderyChain'`, "")}
          </InputFieldError>
        )}
    </InputWrapper>
  );
};

export default ChainSelector;
