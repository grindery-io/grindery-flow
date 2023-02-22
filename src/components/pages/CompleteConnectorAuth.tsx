import axios from "axios";
import React, { useEffect, useState } from "react";
import { getParameterByName } from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";

const GET_OAUTH_TOKEN_ENDPOINT =
  "https://orchestrator.grindery.org/credentials/auth/complete";

type Props = {};

const CompleteConnectorAuth = (props: Props) => {
  const { workspaceToken } = useWorkspaceContext();
  const { access_token } = useAppContext();
  const [message, setMessage] = useState("Authenticating, please wait...");

  useEffect(() => {
    if (workspaceToken || access_token) {
      const codeParam = getParameterByName("code", window.location.href);

      if (codeParam) {
        const data = {
          code: codeParam,
          //redirect_uri: window.location.origin + "/auth",
        };
        axios({
          method: "POST",
          url: GET_OAUTH_TOKEN_ENDPOINT,
          headers: {
            Authorization: `Bearer ${workspaceToken || access_token}`,
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
    }
  }, [workspaceToken, access_token]);

  return <div>{message}</div>;
};

export default CompleteConnectorAuth;
