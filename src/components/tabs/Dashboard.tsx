import React from "react";
import styled from "styled-components";
import { Text, IconButton } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS } from "../../constants";
import { useAppContext } from "../../context/AppContext";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
`;

const Icon = styled.img`
  width: 20px;
`;

const NotificationText = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  color: #8c30f5;
  padding: 0;
  margin: 0;
`;

const CountsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
`;

const CountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 3px;
`;

const IconButtonWrapper = styled.div`
  & .MuiIconButton-root img {
    width: 12px !important;
    height: 12px !important;
  }
`;

const IconButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 4px;
`;

type Props = {};

const Dashboard = (props: Props) => {
  const { workflows, changeTab, setWorkflowOpened } = useAppContext();
  return (
    <Wrapper>
      <DataBox
        size="large"
        LeftComponent={
          <Title>
            <Icon src={ICONS.BELL} alt="notifications icon" />
            <Text value="Notifications" variant="body2" />
          </Title>
        }
        BottomRightComponent={
          <NotificationText>Wallet balance low!</NotificationText>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title>
            <Icon src={ICONS.WALLET} alt="wallet icon" />
            <Text value="Aggregated Balance" variant="body2" />
          </Title>
        }
        RightComponent={
          <IconButtonsGroup>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_ALERT} />
            </IconButtonWrapper>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_DEPOSIT} />
            </IconButtonWrapper>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_WITHDRAW} />
            </IconButtonWrapper>
          </IconButtonsGroup>
        }
        BottomRightComponent={<Text value="$20.40" variant="h3" />}
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              setWorkflowOpened?.(false);
              changeTab?.("WORKFLOWS");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.WORKFLOWS} alt="Workflows icon" />
            <Text value="Workflows" variant="body2" />
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              icon={ICONS.PLUS_SMALL}
              onClick={() => {
                setWorkflowOpened?.(true);
                changeTab?.("WORKFLOWS");
              }}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <div
            onClick={() => {
              setWorkflowOpened?.(false);
              changeTab?.("WORKFLOWS");
            }}
            style={{ cursor: "pointer", marginRight: 4 }}
          >
            <Text value={workflows?.length.toString()} variant="h3" />
          </div>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab?.("APPS");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.APPS} alt="(d)Apps icon" />
            <Text value="(d)Apps" variant="body2" />
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              onClick={() => {
                changeTab?.("APPS");
              }}
              icon={ICONS.PLUS_SMALL}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <CountsWrapper>
            <CountWrapper
              onClick={() => {
                changeTab?.("APPS");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value="1" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="dApp" variant="caption" />
              </div>
            </CountWrapper>
            <CountWrapper
              onClick={() => {
                changeTab?.("APPS");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value="4" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Apps" variant="caption" />
              </div>
            </CountWrapper>
          </CountsWrapper>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab?.("HISTORY");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.HISTORY} alt="History icon" />
            <Text value="History" variant="body2" />
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              onClick={() => {
                changeTab?.("HISTORY");
              }}
              icon={ICONS.ARROW_RIGHT}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <CountsWrapper>
            <CountWrapper
              onClick={() => {
                changeTab?.("HISTORY");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value="2" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Errors" variant="caption" />
              </div>
            </CountWrapper>
            <CountWrapper
              onClick={() => {
                changeTab?.("HISTORY");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value="3" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Executed" variant="caption" />
              </div>
            </CountWrapper>
          </CountsWrapper>
        }
      />
    </Wrapper>
  );
};

export default Dashboard;
