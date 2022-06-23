import React from "react";
import styled from "styled-components";
import { Button, Drawer } from "grindery-ui";
import { Route, Routes, Navigate, useMatch } from "react-router-dom";
import { SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import AppHeader from "./AppHeader";
import SidebarTabs from "./SidebarTabs";
import useWindowSize from "../../hooks/useWindowSize";
import AppsPage from "../pages/AppsPage";
import DashboardPage from "../pages/DashboardPage";
import HistoryPage from "../pages/HistoryPage";
import NotificationsPage from "../pages/NotificationsPage";
import SettingsPage from "../pages/SettingsPage";
import TransactionsPage from "../pages/TransactionsPage";
import WelcomePage from "../pages/WelcomePage";
import WorkflowsPage from "../pages/WorkflowsPage";
import WorkflowBuilderPage from "../pages/WorkflowBuilderPage";
import CreateWorkflowPage from "../pages/CreateWorkflowPage";

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
  padding-top: 67px;
  min-height: calc(100vh - 100px);
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 1068px;
    margin-left: auto;
    margin-right: auto;
    min-height: calc(100vh - 105px);
    padding-bottom: 40px;
    box-sizing: border-box;
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
  const { workflows, user, appOpened, setAppOpened } = useAppContext();
  const size = useWindowSize();
  let matchNewWorfklow = useMatch("/workflows/new");

  const renderContent = () => {
    if (!user) {
      return <WelcomePage />;
    }

    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route
          path="/workflows"
          element={
            !workflows || workflows.length < 1 ? (
              <CreateWorkflowPage />
            ) : (
              <WorkflowsPage />
            )
          }
        ></Route>
        <Route path="/workflows/new" element={<WorkflowBuilderPage />}></Route>
        <Route path="/d-apps" element={<AppsPage />}></Route>
        <Route path="/history" element={<HistoryPage />}></Route>
        <Route path="/transactions" element={<TransactionsPage />}></Route>
        <Route path="/notifications" element={<NotificationsPage />}></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
      </Routes>
    );
    /**/
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
              <ContentWrapper>{renderContent()}</ContentWrapper>
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
          <div
            style={{
              marginLeft: !matchNewWorfklow
                ? appOpened
                  ? "210px"
                  : "60px"
                : "0px",
              transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            }}
          >
            <ContentWrapper>{renderContent()}</ContentWrapper>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;
