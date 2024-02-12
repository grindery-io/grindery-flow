import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { getParameterByName } from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { ICONS } from "../../constants";

const GET_OAUTH_TOKEN_ENDPOINT =
  "https://orchestrator.grindery.com/credentials/auth/complete";

const MESSAGES = {
  DEFAULT: "Authenticating, please wait...",
  ERROR:
    "Server error. Please, try to reload the page.\nOr close the window, return to Zapier and sign-in again.",
  SUCCESS:
    "Authentication complete.\nYou can close this window and return to Zapier.",
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
    margin: 20px 0 0;
    padding: 0;
    text-align: center;
    white-space: pre-wrap;
  }

  & img {
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 auto;
  }
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
        {message === MESSAGES.DEFAULT && <CircularProgress />}
        {message === MESSAGES.ERROR && <img src={ICONS.ERROR} alt="" />}
        {message === MESSAGES.SUCCESS && <img src={ICONS.EXECUTED} alt="" />}
        <p>{message}</p>
      </Content>
    </Container>
  );
};

export default CompleteConnectorAuth;
