import React from "react";
import styled from "styled-components";
import { IconButton } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import Logo from "./Logo";
import { ICONS, SCREEN } from "../../constants";
import useWindowSize from "../../hooks/useWindowSize";
import { useMatch, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import WorkspaceSelector from "./WorkspaceSelector";

const Wrapper = styled.div`
  border-bottom: 1px solid #dcdcdc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  position: fixed;
  background: #ffffff;
  width: 435px;
  max-width: 100vw;
  box-sizing: border-box;
  z-index: 2;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    top: 0;
    max-width: 100%;
  }
`;

const UserWrapper = styled.div`
  margin-left: auto;
  order: 4;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
  }
`;

const CloseButtonWrapper = styled.div`
  & .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    margin-left: 0;
    margin-right: 8px;
    order: 1;
  }
`;

const LogoWrapper = styled.div`
  order: 1;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 2;
  }
`;

const CompanyNameWrapper = styled.div`
  display: none;
  @media (min-width: ${SCREEN.TABLET}) {
    display: block;
    order: 3;
    font-weight: 700;
    font-size: 16px;
    line-height: 110%;
    color: #0b0d17;
    cursor: pointer;
  }
`;

const BackWrapper = styled.div`
  & img {
    width: 16px;
    height: 16px;
  }
`;

const DevModeIndicator = styled.div`
  display: none;
  @media (min-width: ${SCREEN.TABLET}) {
    display: block;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #ff5858;
    order: 3;
  }
`;

const WorkspaceSelectorWrapper = styled.div`
  margin-left: 14px;
  order: 2;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 3;
  }
`;

type Props = {};

const AppHeader = (props: Props) => {
  const { user, setAppOpened, appOpened, devMode } = useAppContext();
  const { size, width } = useWindowSize();
  let navigate = useNavigate();
  const isMatchingWorkflowNew = useMatch("/workflows/new");
  const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
  const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;

  const handleClose = () => {
    setAppOpened(!appOpened);
  };

  const handleBack = () => {
    navigate("/workflows");
  };

  return (
    <Wrapper>
      {user && matchNewWorfklow && (
        <BackWrapper>
          <IconButton icon={ICONS.BACK} onClick={handleBack} color="" />
        </BackWrapper>
      )}
      <LogoWrapper>
        <Logo variant="square" />
      </LogoWrapper>
      <CompanyNameWrapper
        onClick={() => {
          navigate("/");
        }}
      >
        Grindery Nexus
      </CompanyNameWrapper>
      {user && !matchNewWorfklow && (
        <WorkspaceSelectorWrapper>
          <WorkspaceSelector />
        </WorkspaceSelectorWrapper>
      )}
      {devMode && <DevModeIndicator>Developer mode</DevModeIndicator>}
      {user && (
        <UserWrapper>
          <UserMenu />
        </UserWrapper>
      )}

      {user &&
        (!matchNewWorfklow || size === "phone") &&
        ((width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
          width < parseInt(SCREEN.TABLET_XL.replace("px", ""))) ||
          width >= parseInt(SCREEN.DESKTOP.replace("px", ""))) && (
          <CloseButtonWrapper style={{ marginLeft: !user ? "auto" : "0px" }}>
            {size === "desktop" && !appOpened ? (
              <IconButton icon={ICONS.MENU} onClick={handleClose} color="" />
            ) : size === "desktop" ? (
              <IconButton
                icon={ICONS.COLLAPSE}
                onClick={handleClose}
                color=""
              />
            ) : (
              <IconButton icon={ICONS.CLOSE} onClick={handleClose} color="" />
            )}
          </CloseButtonWrapper>
        )}
    </Wrapper>
  );
};

export default AppHeader;
