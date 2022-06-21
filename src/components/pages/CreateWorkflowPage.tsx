import React from "react";
import styled from "styled-components";
import { Button } from "grindery-ui";
import { ICONS, SCREEN } from "../../constants";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100% - 48px);
  @media (min-width: ${SCREEN.DESKTOP}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }
`;

const Title = styled.p`
font-weight: 700;
font-size: 25px;
line-height: 120%;
text-align: center;
color: rgba(0, 0, 0, 0.87);
padding: 0
margin: 0 0 15px;
@media (min-width: ${SCREEN.DESKTOP}) {
  max-width: 576px;
  margin: 0 auto 15px;
}
`;

const Img = styled.img`
  margin: 0 auto 15px;
  width: 335px;
  height: 322px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    width: 500px;
    height: 480px;
  }
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 5px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 576px;
    margin: 0 auto 5px;
  }
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

const CreateWorkflowPage = (props: Props) => {
  let navigate = useNavigate();
  return (
    <Wrapper>
      <Title>
        Create your first
        <br />
        workflow
      </Title>
      <Img src="/images/create-workflow.svg" alt="Create workflow" />
      <Desc>
        Create workflows to connect a Web2 to a Web3 App or viceversa.
      </Desc>
      <ButtonWrapper>
        <Button
          value="Create workflow"
          onClick={() => {
            navigate("/workflows/new");
          }}
          icon={ICONS.PLUS_WHITE}
        />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default CreateWorkflowPage;
