import React from "react";
import styled from "styled-components";
//import { TabComponent } from "grindery-ui";
import { RIGHTBAR_TABS } from "../../constants";
import { useAppContext } from "../../context/AppContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  background: #fdfbff;
  box-shadow: inset 0px -2px 20px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 61px);
  height: 100%;
`;

const TabButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  padding: 18px;
`;

type Props = {};

const RightBarTabs = (props: Props) => {
  const { user, changeTab, activeTab } = useAppContext();

  const handleTabClick = (name: string) => {
    changeTab?.(name);
  };

  return (
    <Wrapper>
      {/*<TabComponent
        value={activeTab}
        onChange={(e: any) => {
          console.log("tabs e", e);
        }}
        options={RIGHTBAR_TABS.map((tab) => (<img src={tab.icon} alt={tab.name} />))}
        orientation="vertical"
        activeIndicatorColor="#0B0D17"
      />*/}
      {RIGHTBAR_TABS.map((tab, i) => (
        <TabButton
          key={tab.name}
          onClick={() => {
            if (user) {
              handleTabClick(tab.name);
            }
          }}
          style={{
            background:
              activeTab === tab.id && user ? "#ffffff" : "transparent",
          }}
        >
          {tab.icon ? (
            <img
              style={{ opacity: activeTab === tab.id && user ? 1 : 0.2 }}
              src={tab.icon}
              alt={tab.name}
            />
          ) : (
            i
          )}
        </TabButton>
      ))}
    </Wrapper>
  );
};

export default RightBarTabs;
