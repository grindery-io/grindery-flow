import React from "react";
import { RIGHTBAR_TABS } from "../constants";
import { useAppContext } from "../context/AppContext";

type Props = {};

const RightBarTabs = (props: Props) => {
  const { setActiveTab, activeTab } = useAppContext();

  const handleTabClick = (key: number) => {
    setActiveTab?.(key);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        flexWrap: "nowrap",
        background: "#FDFBFF",
        boxShadow: "inset 0px -2px 20px rgba(0, 0, 0, 0.08)",
        minHeight: "calc(100vh - 61px)",
        height: "100%",
      }}
    >
      {RIGHTBAR_TABS.map((tab, i) => (
        <div
          key={tab.name}
          onClick={() => {
            handleTabClick(i);
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            padding: 18,
            background: activeTab === i ? "#ffffff" : "transparent",
          }}
        >
          {tab.icon ? (
            <img
              style={{ opacity: activeTab === i ? 1 : 0.2 }}
              src={tab.icon}
              alt={tab.name}
            />
          ) : (
            i
          )}
        </div>
      ))}
    </div>
  );
};

export default RightBarTabs;
