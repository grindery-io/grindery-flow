import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getParameterByName } from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";

const GET_OAUTH_TOKEN_ENDPOINT =
  "https://orchestrator.grindery.org/credentials/auth/complete";

type Props = {};

const CompleteConnectorAuth = (props: Props) => {
  const { workspaceToken, setWorkspace } = useWorkspaceContext();
  let { space } = useParams();
  const { access_token } = useAppContext();
  const [message, setMessage] = useState("Authenticating, please wait...");

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
            setMessage(
              "Authentication complete. You can close this window and return to Zapier."
            );
          }
        })
        .catch((err) => {
          console.error("getAccessTokenRequest err", err);
          setMessage(
            "Server error. Please, try to reload the page. Or close the window, return to Zapier and sign-in again."
          );
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

  return <div>{message}</div>;
};

export default CompleteConnectorAuth;
