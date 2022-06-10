import React from "react";
import { RIGHTBAR_TABS } from "../constants";
import { useAppContext } from "../context/AppContext";
import AppHeader from "./AppHeader";
import Dashboard from "./Dashboard";
import RightBarTabs from "./RightBarTabs";
import WorkflowConstructor from "./WorkflowConstructor";

type Props = {};

const RightBar = (props: Props) => {
  const { activeTab } = useAppContext();

  const renderContent = (tab: number) => {
    switch (RIGHTBAR_TABS[tab].name) {
      case "DASHBOARD":
        return <Dashboard />;
      case "NEW_WORKFLOW":
        return <WorkflowConstructor />;
      default:
        return (
          <div style={{ textAlign: "center", padding: 30 }}>
            {RIGHTBAR_TABS[tab]?.name || ""}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        maxWidth: 435,
        margin: "0 0 0 auto",
        borderLeft: "1px solid #DCDCDC",
        minHeight: "100vh",
        background: "#FFFFFF",
      }}
    >
      <AppHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-start",
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 375,
          }}
        >
          {renderContent(activeTab || 0)}
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 60,
          }}
        >
          <RightBarTabs />
        </div>
      </div>
    </div>
  );
};

export default RightBar;
