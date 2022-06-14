import React from "react";
import styled from "styled-components";
import ConnectButton from "../shared/ConnectButton";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100% - 48px);
`;

const Title = styled.p`
font-weight: 700;
font-size: 25px;
line-height: 120%;
text-align: center;
color: rgba(0, 0, 0, 0.87);
padding: 0
margin: 0 0 15px;
`;

const Img = styled.img`
  margin: 0 0 15px;
  width: 335px;
  height: 322px;
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 5px;
`;

const ButtonWrapper = styled.div`
  max-width: 200px;
  margin: 0 auto;
  width: 100%;
`;

type Props = {};

const Welcome = (props: Props) => {
  return (
    <Wrapper>
      <Title>
        Welcome to
        <br />
        Grindery Nexus
      </Title>
      <Img src="/images/welcome.svg" alt="Welcome" />
      <Desc>
        We are the easiest way for people and organizations to connect Apps and
        dApps across chains and protocols.
      </Desc>
      <ButtonWrapper>
        <ConnectButton />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Welcome;
