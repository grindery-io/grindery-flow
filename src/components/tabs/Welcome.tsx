import React from "react";
import styled from "styled-components";
import { Button } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import ConnectButton from "../shared/ConnectButton";
import { ICONS } from "../../constants";

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
  & .MuiButton-startIcon > img {
    background: none;
    border: none;
    padding: 0;
  }
`;

type Props = {};

const Welcome = (props: Props) => {
  const { user, changeTab, setWorkflowOpened } = useAppContext();
  return (
    <Wrapper>
      <Title>
        {!user ? (
          <>
            Welcome to
            <br />
            Grindery Nexus
          </>
        ) : (
          <>
            Create your first
            <br />
            workflow
          </>
        )}
      </Title>
      <Img
        src={!user ? "/images/welcome.svg" : "/images/create-workflow.svg"}
        alt={!user ? "Welcome" : "Create workflow"}
      />
      <Desc>
        {!user
          ? "We are the easiest way for people and organizations to connect Apps and dApps across chains and protocols."
          : "Create workflows to connect a Web2 to a Web3 App or viceversa."}
      </Desc>
      <ButtonWrapper>
        {!user ? (
          <ConnectButton />
        ) : (
          <Button
            value="Create workflow"
            onClick={() => {
              setWorkflowOpened?.(true);
              changeTab?.("WORKFLOWS");
            }}
            icon={ICONS.PLUS_WHITE}
          />
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Welcome;
