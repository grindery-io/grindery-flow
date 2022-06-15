import React, { useEffect } from "react";
import styled from "styled-components";
import { Button, Drawer } from "grindery-ui";
import { RIGHTBAR_TABS } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import AppHeader from "./AppHeader";
import Dashboard from "../tabs/Dashboard";
import Notifications from "../tabs/Notifications";
import RightBarTabs from "./RightBarTabs";
import Workflows from "../tabs/Workflows";
import Apps from "../tabs/Apps";
import History from "../tabs/History";
import Transactions from "../tabs/Transactions";
import Settings from "../tabs/Settings";
import Welcome from "../tabs/Welcome";

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 435px;
`;

const TabsWrapper = styled.div`
  width: 100%;
  max-width: 60px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 375px;
  margin-top: 67px;
`;

const OpenButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 40px;
`;

type Props = {};

const RightBar = (props: Props) => {
  const { workflows, user, activeTab, appOpened, setAppOpened } =
    useAppContext();

  const renderContent = (tab: number) => {
    if (!user || (activeTab === 0 && (!workflows || workflows.length < 1))) {
      return <Welcome />;
    }
    switch (RIGHTBAR_TABS[tab].name || "") {
      case "DASHBOARD":
        return <Dashboard />;
      case "WORKFLOWS":
        return <Workflows />;
      case "APPS":
        return <Apps />;
      case "HISTORY":
        return <History />;
      case "TRANSACTIONS":
        return <Transactions />;
      case "NOTIFICATIONS":
        return <Notifications />;
      case "SETTINGS":
        return <Settings />;
      default:
        return (
          <div style={{ textAlign: "center", padding: 30 }}>
            {RIGHTBAR_TABS[tab].name || ""}
          </div>
        );
    }
  };

  const handleOpen = () => {
    setAppOpened?.(true);
  };

  return (
    <>
      <OpenButtonWrapper>
        <Button value="Open app" onClick={handleOpen} />
      </OpenButtonWrapper>
      <Drawer open={appOpened} anchor="right" variant="persistent">
        <AppHeader />
        <BarWrapper>
          <ContentWrapper>{renderContent(activeTab || 0)}</ContentWrapper>
          <TabsWrapper>
            <RightBarTabs />
          </TabsWrapper>
        </BarWrapper>
      </Drawer>
    </>
  );
};

export default RightBar;
