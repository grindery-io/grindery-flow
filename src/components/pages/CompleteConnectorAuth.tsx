import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { getParameterByName } from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import Logo from "../shared/Logo";
import { ICONS } from "../../constants";

const GET_OAUTH_TOKEN_ENDPOINT =
  "https://orchestrator.grindery.org/credentials/auth/complete";

const MESSAGES = {
  DEFAULT: "Authenticating, please wait...",
  ERROR:
    "Server error. Please, try to reload the page. Or close the window, return to Zapier and sign-in again.",
  SUCCESS:
    "Authentication complete. You can close this window and return to Zapier.",
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

const Content = styled.div`
  max-width: 450px;
  padding: 30px 20px;
  text-align: center;

  & p {
    margin: 0 0 20px;
    padding: 0;
    text-align: center;
  }

  & img {
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 auto;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;
  margin: 0 0 30px;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 22px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
`;

type Props = {};

const CompleteConnectorAuth = (props: Props) => {
  const { workspaceToken, setWorkspace } = useWorkspaceContext();
  let { space } = useParams();
  const { access_token } = useAppContext();
  const [message, setMessage] = useState(MESSAGES.DEFAULT);

  const completeAuth = (token: string) => {
    const codeParam = getParameterByName("code", window.location.href);

    if (codeParam) {
      const data = {
        code: codeParam,
      };
      axios({
        method: "POST",
        url: GET_OAUTH_TOKEN_ENDPOINT,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      })
        .then((res) => {
          if (res && res.data) {
            setMessage(MESSAGES.SUCCESS);
          }
        })
        .catch((err) => {
          console.error("getAccessTokenRequest err", err);
          setMessage(MESSAGES.ERROR);
        });
    }
  };

  useEffect(() => {
    if (space) {
      if (space === "default") {
        if (access_token) {
          completeAuth(access_token);
        }
      } else {
        setWorkspace(space);
        if (workspaceToken) {
          completeAuth(workspaceToken);
        }
      }
    }
  }, [workspaceToken, access_token, space]);

  return (
    <Container>
      <Content>
        <LogoWrapper>
          <Logo variant="square" width="40px" />
          <Title>Gateway</Title>
        </LogoWrapper>
        <p>{message}</p>
        {message === MESSAGES.DEFAULT && <CircularProgress />}
        {message === MESSAGES.ERROR && <img src={ICONS.ERROR} alt="" />}
        {message === MESSAGES.SUCCESS && <img src={ICONS.EXECUTED} alt="" />}
      </Content>
    </Container>
  );
};

export default CompleteConnectorAuth;
