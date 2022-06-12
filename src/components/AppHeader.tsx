import React from "react";
import styled from "styled-components";
import Logo from "./Logo";

const Wrapper = styled.div`
  border-bottom: 1px solid #dcdcdc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
`;

type Props = {};

const AppHeader = (props: Props) => {
  return (
    <Wrapper>
      <Logo variant="horizontal" />
    </Wrapper>
  );
};

export default AppHeader;
