import React from "react";
import styled from "styled-components";
import { TabComponent } from "grindery-ui";
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

  & .MuiTabs-root {
    background: transparent !important;
  }

  & .MuiTab-root {
    max-width: 60px !important;
    width: 60px !important;
    min-width: 60px !important;
    height: 60px !important;
    min-height: 60px !important;
    text-align: center !important;
    z-index: 2;
  }

  & .MuiTabs-indicator {
    right: auto !important;
    left: 0 !important;
    width: 60px;
    background: #ffffff !important;
    z-index: 1;

    &:after {
      content: "";
      display: block;
      posotion: absolute;
      left: 0;
      top: 0;
      width: 3px;
      background: #0b0d17;
      border-radius: 3px;
      height: 100%;
    }
  }
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
  const { activeTab, setActiveTab } = useAppContext();

  return (
    <Wrapper>
      <TabComponent
        value={activeTab || 0}
        onChange={(index: number) => {
          setActiveTab?.(index);
        }}
        options={RIGHTBAR_TABS.map((tab) => (
          <img src={tab.icon} alt={tab.name} />
        ))}
        orientation="vertical"
        activeIndicatorColor="#0B0D17"
        activeColor="#000000"
        type="icon"
        tabColor="#000000"
      />
    </Wrapper>
  );
};

export default RightBarTabs;
