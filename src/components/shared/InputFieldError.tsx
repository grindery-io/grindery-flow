import React from "react";
import styled from "styled-components";

const ErrorWrapper = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #ff5858;
  position: relative;
  margin-top: -14px;
`;

type Props = {
  children?: React.ReactNode;
};

const InputFieldError = (props: Props) => {
  const { children } = props;
  if (!children) {
    return null;
  }
  return <ErrorWrapper>{children}</ErrorWrapper>;
};

export default InputFieldError;
