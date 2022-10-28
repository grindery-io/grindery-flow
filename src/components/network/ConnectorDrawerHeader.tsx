import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { ICONS } from "../../constants";
import Button from "./Button";

const Container = styled.div`
  padding: 20px;
  border-bottom: 1px solid #dcdcdc;
  position: sticky;
  top: 75px;
  background: #f4f5f7;
`;

const ConnectorHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
`;

const ConnectorIcon = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;

  & img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const ConnectorName = styled.div`
  & h2 {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #141416;
    margin: 0;
    padding: 0;
  }

  & p {
    margin: 5px 0 0;
    padding: 0;

    & span {
      background: #ffffff;
      border-radius: 5px;
      text-transform: uppercase;
      font-size: 12px;
      padding: 4px 8px;
      font-weight: 600;
    }
  }
`;

const PublishButton = styled.div`
  padding: 20px 0 0;
  text-align: center;

  & button {
    width: 100%;
    padding: 8px 24px;
  }
`;

type Props = {
  connector: any;
};

const ConnectorDrawerHeader = (props: Props) => {
  let navigate = useNavigate();
  const { connector } = props;
  return (
    <Container>
      <ConnectorHeader>
        <ConnectorIcon>
          <img
            src={connector.values.icon || ICONS.NEXUS_SQUARE}
            alt={connector.values.name}
          />
        </ConnectorIcon>
        <ConnectorName>
          <h2>{connector.values.name}</h2>
          <p>
            <span>{connector.values.type} </span>
          </p>
        </ConnectorName>
      </ConnectorHeader>
      <PublishButton>
        <Button
          onClick={() => {
            navigate(`/network/connector/${connector.id}/publish`);
          }}
        >
          Publish
        </Button>
      </PublishButton>
    </Container>
  );
};

export default ConnectorDrawerHeader;