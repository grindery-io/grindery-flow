import React from "react";
import styled from "styled-components";
import { IconButton } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import Logo from "./Logo";
import { ICONS, SCREEN } from "../../constants";
import useWindowSize from "../../hooks/useWindowSize";
import { useMatch, useNavigate } from "react-router-dom";

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
  border: 1px solid #d3deec;
  border-radius: 34px;
  padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 6px;
  margin-left: auto;

  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
  }
`;

const UserStatus = styled.div`
  background: #00b674;
  width: 16px;
  height: 16px;
  border-radius: 8px;
`;

const UserId = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  margin: 0;
  padding: 0;
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

type Props = {};

const AppHeader = (props: Props) => {
  const { user, setAppOpened, appOpened } = useAppContext();
  const { size, width } = useWindowSize();
  let navigate = useNavigate();
  let matchNewWorfklow = useMatch("/workflows/new");

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
      {user && (
        <UserWrapper>
          <UserStatus />
          <UserId>
            {user.substring(0, 5) + "..." + user.substring(user.length - 4)}
          </UserId>
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
