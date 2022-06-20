import React from "react";
import styled from "styled-components";
import { TabComponent } from "grindery-ui";
import { RIGHTBAR_TABS, SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import useWindowSize from "../../hooks/useWindowSize";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  background: #fdfbff;
  box-shadow: inset 0px -2px 20px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 67px);
  height: calc(100vh - 67px);
  max-height: calc(100vh - 67px);
  position: fixed;
  top: 67px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${SCREEN.DESKTOP}) {
    transition: all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

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

    & p {
      display: none;
    }

    @media (min-width: ${SCREEN.DESKTOP}) {
      width: 210px !important;
      max-width: 210px !important;
      text-align: left !important;
      justify-content: flex-start !important;
      padding: 18px;

      p {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        color: #0b0d17;
        margin-left: 36px;
        text-transform: initial;
      }
    }
  }

  & .MuiTabs-indicator {
    right: auto !important;
    left: 0 !important;
    width: 60px;
    background: #ffffff !important;
    z-index: 1;

    @media (min-width: ${SCREEN.DESKTOP}) {
      width: 210px;
    }

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

type Props = {};

const SidebarTabs = (props: Props) => {
  const { user, activeTab, setActiveTab, appOpened } = useAppContext();
  const size = useWindowSize();

  return (
    <Wrapper
      style={{
        maxWidth: size === "desktop" && appOpened ? "210px" : "60px",
      }}
    >
      <TabComponent
        value={activeTab || 0}
        onChange={(index: number) => {
          if (user) {
            setActiveTab(index);
          }
        }}
        options={RIGHTBAR_TABS.map((tab) => (
          <>
            <img
              src={tab.icon}
              alt={tab.name}
              style={{ opacity: activeTab !== tab.id ? "0.2" : 1 }}
            />
            <p>{tab.label}</p>
          </>
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

export default SidebarTabs;
