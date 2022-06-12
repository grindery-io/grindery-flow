import React from "react";
import styled from "styled-components";
import { RIGHTBAR_TABS } from "../constants";
import { useAppContext } from "../context/AppContext";
import AppHeader from "./AppHeader";
import Dashboard from "./Tabs/Dashboard";
import Notifications from "./Tabs/Notifications";
import RightBarTabs from "./RightBarTabs";
import Workflows from "./Tabs/Workflows";

const Wrapper = styled.div`
  max-width: 435px;
  margin: 0 0 0 auto;
  border-left: 1px solid #dcdcdc;
  min-height: 100vh;
  background: #ffffff;
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const TabsWrapper = styled.div`
  width: 100%;
  max-width: 60px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 375px;
`;

type Props = {};

const RightBar = (props: Props) => {
  const { activeTab } = useAppContext();

  const renderContent = (tab: number) => {
    switch (RIGHTBAR_TABS[tab].name) {
      case "DASHBOARD":
        return <Dashboard />;
      case "NEW_WORKFLOW":
        return <Workflows />;
      case "NOTIFICATIONS":
        return <Notifications />;
      default:
        return (
          <div style={{ textAlign: "center", padding: 30 }}>
            {RIGHTBAR_TABS[tab]?.name || ""}
          </div>
        );
    }
  };

  return (
    <Wrapper>
      <AppHeader />
      <BarWrapper>
        <ContentWrapper>{renderContent(activeTab || 0)}</ContentWrapper>
        <TabsWrapper>
          <RightBarTabs />
        </TabsWrapper>
      </BarWrapper>
    </Wrapper>
  );
};

export default RightBar;
