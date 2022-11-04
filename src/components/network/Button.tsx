import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  & button {
    font-family: Roboto;
    background: #ffb930;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 12px 24px;
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0);
    border: none;
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;

      &:hover {
        box-shadow: 0px 4px 8px rgba(106, 71, 147, 0);
      }
    }
  }
`;

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  style?: any;
  disabled?: boolean;
};

const Button = (props: Props) => {
  const { children, onClick, style, disabled } = props;
  return (
    <Wrapper>
      <button style={style || {}} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </Wrapper>
  );
};

export default Button;
