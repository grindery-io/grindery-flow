import React from "react";
import styled from "styled-components";
import { Text } from "grindery-ui";
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

const NotificationCount = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  color: #ffffff;
  background: #ff5858;
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

type Props = {};

const Dashboard = (props: Props) => {
  const { changeTab } = useAppContext();
  return (
    <Wrapper>
      <DataBox
        size="large"
        LeftComponent={
          <Title
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              changeTab?.("NOTIFICATIONS");
            }}
          >
            <Icon src={ICONS.BELL} alt="notifications icon" />
            <Text value="Notifications" variant="body2" />
          </Title>
        }
        RightComponent={
          <NotificationCount
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              changeTab?.("NOTIFICATIONS");
            }}
          >
            <Text value="3" variant="body2" />
          </NotificationCount>
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
        BottomRightComponent={<Text value="$20.40" variant="h3" />}
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab?.("NEW_WORKFLOW");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.WORKFLOWS} alt="Workflows icon" />
            <Text value="Workflows" variant="body2" />
          </Title>
        }
        BottomRightComponent={
          <div
            onClick={() => {
              changeTab?.("NEW_WORKFLOW");
            }}
            style={{ cursor: "pointer" }}
          >
            <Text value="5" variant="h3" />
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
        BottomRightComponent={
          <CountsWrapper>
            <CountWrapper
              onClick={() => {
                changeTab?.("HISTORY");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value="1" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Error" variant="caption" />
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
