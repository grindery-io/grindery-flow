import React from "react";
import styled from "styled-components";
import { Button, Drawer } from "grindery-ui";
import { RIGHTBAR_TABS, SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import AppHeader from "./AppHeader";
import Dashboard from "../tabs/Dashboard";
import Notifications from "../tabs/Notifications";
import SidebarTabs from "./SidebarTabs";
import Workflows from "../tabs/Workflows";
import Apps from "../tabs/Apps";
import History from "../tabs/History";
import Transactions from "../tabs/Transactions";
import Settings from "../tabs/Settings";
import Welcome from "../tabs/Welcome";
import useWindowSize from "../../hooks/useWindowSize";

const DrawerWrapper = styled.div`
  @media (min-width: ${SCREEN.DESKTOP}) {
    .MuiPaper-root {
      transform: none !important;
      visibility: visible !important;
    }
  }
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 435px;

  @media (min-width: ${SCREEN.DESKTOP}) {
    width: 100%;
  }
`;

const TabsWrapper = styled.div`
  width: 100%;
  max-width: 60px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 210px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 375px;
  margin-top: 67px;
  min-height: calc(100vh - 100px);
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 1028px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 67px;
  }
`;

const OpenButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 40px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    right: auto;
    left: 18px;
    top: 18px;
  }
`;

type Props = {};

const MainLayout = (props: Props) => {
  const { workflows, user, activeTab, appOpened, setAppOpened } =
    useAppContext();
  const size = useWindowSize();

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
    setAppOpened(!appOpened);
  };

  return (
    <>
      {size === "phone" && (
        <OpenButtonWrapper>
          <Button value="Open app" onClick={handleOpen} />
        </OpenButtonWrapper>
      )}
      <DrawerWrapper>
        <Drawer
          open={appOpened}
          anchor={size === "desktop" ? "left" : "right"}
          variant="persistent"
        >
          {size === "phone" && <AppHeader />}
          <BarWrapper>
            {size === "phone" && (
              <ContentWrapper>{renderContent(activeTab || 0)}</ContentWrapper>
            )}
            <TabsWrapper
              style={{
                maxWidth: size === "desktop" && appOpened ? "210px" : "60px",
              }}
            >
              <SidebarTabs />
            </TabsWrapper>
          </BarWrapper>
        </Drawer>
      </DrawerWrapper>
      {size === "desktop" && (
        <>
          <AppHeader />
          <div style={{ marginLeft: appOpened ? "210px" : "60px" }}>
            <ContentWrapper>{renderContent(activeTab || 0)}</ContentWrapper>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;
