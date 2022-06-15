import React from "react";
import styled from "styled-components";
import { IconButton } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import Logo from "./Logo";
import { ICONS } from "../../constants";

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
  box-sizing: border-box;
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
  margin-left: auto;
  & .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }
`;

type Props = {};

const AppHeader = (props: Props) => {
  const { user, setAppOpened } = useAppContext();

  const handleClose = () => {
    setAppOpened?.(false);
  };

  return (
    <Wrapper>
      <Logo variant="square" />
      {user && (
        <UserWrapper>
          <UserStatus />
          <UserId>
            {user.substring(0, 5) + "..." + user.substring(user.length - 4)}
          </UserId>
        </UserWrapper>
      )}
      <CloseButtonWrapper>
        <IconButton icon={ICONS.CLOSE} onClick={handleClose} color="" />
      </CloseButtonWrapper>
    </Wrapper>
  );
};

export default AppHeader;
