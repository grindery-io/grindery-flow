import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { ICONS } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import UserMenu from "../shared/UserMenu";
import WorkspaceSelector from "../shared/WorkspaceSelector";

const Container = styled.div`
  padding: 10px 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  background: #0b0d17;
  position: fixed;
  z-index: 1210;
  top: 0;
  width: 100%;
  box-sizing: border-box;
`;

const LeftWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 15px 0;
`;

const RightWrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 15px 0;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.02em;
  color: #ffffff;
`;

const Subtitle = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  color: #e48b05;
`;

type Props = {};

const Header = (props: Props) => {
  let navigate = useNavigate();
  const { user } = useAppContext();
  return (
    <Container>
      <LeftWrapper>
        <Logo
          onClick={() => {
            navigate("/network");
          }}
        >
          <img
            src={ICONS.GRINDERY_DEV_LOGO}
            alt="Grindery developer network logo"
          />
          <div>
            <Title>Nexus</Title>
            <Subtitle>Developer Network</Subtitle>
          </div>
        </Logo>
      </LeftWrapper>
      <RightWrapper>
        {user && <WorkspaceSelector mode="dark" />}
        {user && <UserMenu mode="dark" />}
      </RightWrapper>
    </Container>
  );
};

export default Header;
