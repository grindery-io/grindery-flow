import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Text, Button } from "grindery-ui";
import { useAppContext } from "../../context/AppContext";
import Check from "./../icons/Check";
import { Field } from "../../types/Connector";
import TriggerInputField from "./TriggerInputField";
import { getParameterByName } from "../../utils";

const Wrapper = styled.div`
  padding: 20px;
`;
const TitleWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const TitleIconWrapper = styled.div`
  display: inline-block;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  margin: 0px auto 10px;
`;

const TitleIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;

const AccountWrapper = styled.div`
  margin-top: 40px;
  text-align: left;
  margin-bottom: 40px;
`;

const AccountNameWrapper = styled.div`
  padding: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

type Props = {
  step: number;
};

const TriggerConfiguration = (props: Props) => {
  const { step } = props;
  const {
    workflow,
    updateWorkflow,
    trigger,
    triggerAuthenticationFields,
    triggerAuthenticationIsRequired,
    triggerIsAuthenticated,
    triggerConnector,
    activeStep,
    setActiveStep,
    triggerIsConfigured,
  } = useAppContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const inputFields =
    trigger &&
    trigger.operation &&
    trigger.operation.inputFields &&
    trigger.operation.inputFields.filter(
      (inputField: { computed: any }) => inputField && !inputField.computed
    );

  const clearCredentials = () => {
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
  };

  const receiveMessage = (e: any) => {
    if (e.origin === window.location.origin) {
      const { data } = e;

      if (data.gr_url) {
        const codeParam = getParameterByName("code", data.gr_url);

        if (
          triggerConnector &&
          triggerConnector.authentication &&
          triggerConnector.authentication.type &&
          triggerConnector.authentication.type === "oauth2" &&
          codeParam &&
          triggerConnector.authentication.oauth2Config &&
          triggerConnector.authentication.oauth2Config.getAccessToken
        ) {
          const getAccessTokenRequest =
            triggerConnector.authentication.oauth2Config.getAccessToken;
          axios({
            method: getAccessTokenRequest.method,
            url: getAccessTokenRequest.url,
            headers: getAccessTokenRequest.headers || {},
            data: {
              ...getAccessTokenRequest.body,
              code: codeParam,
              redirect_uri: window.location.origin + "/auth",
            },
          })
            .then((res) => {
              if (res && res.data && triggerAuthenticationFields) {
                const credentials = Object.fromEntries(
                  triggerAuthenticationFields.map((field) => [
                    field,
                    res.data[field] || "",
                  ])
                );
                testAuth(credentials);
              }
            })
            .catch((err) => {
              console.log("getAccessTokenRequest err", err);
            });
        }

        e.source.postMessage({ gr_close: true }, window.location.origin);
        window.removeEventListener("message", receiveMessage, false);
      }
    }
  };

  const testAuth = (credentials: any) => {
    if (
      triggerConnector &&
      triggerConnector.authentication &&
      triggerConnector.authentication.test
    ) {
      const headers = triggerConnector.authentication.test.headers;
      const url = triggerConnector.authentication.test.url;
      const method = triggerConnector.authentication.test.method;
      axios({
        method: method,
        url: `${url}${
          /\?/.test(url) ? "&" : "?"
        }timestamp=${new Date().getTime()}`,
        headers: {
          ...headers,
          Authorization: "Bearer " + credentials.access_token,
        },
      })
        .then((res) => {
          if (res && res.data && res.data.email) {
            setEmail(res.data.email);
            updateWorkflow?.({
              "trigger.credentials": credentials,
            });
          }
        })
        .catch((err) => {
          clearCredentials();
          setEmail("");
        });
    }
  };

  const handleAuthClick = () => {
    if (triggerAuthenticationFields && triggerAuthenticationFields.length > 0) {
      if (
        triggerConnector &&
        triggerConnector.authentication &&
        triggerConnector.authentication.type &&
        triggerConnector.authentication.type === "oauth2"
      ) {
        window.removeEventListener("message", receiveMessage, false);
        const width = 375,
          height = 500,
          left = window.screen.width / 2 - width / 2,
          top = window.screen.height / 2 - height / 2;
        let windowObjectReference = window.open(
          triggerConnector.authentication.oauth2Config.authorizeUrl.url +
            "&redirect_uri=" +
            window.location.origin +
            "/auth",
          "_blank",
          "status=no, toolbar=no, menubar=no, width=" +
            width +
            ", height=" +
            height +
            ", top=" +
            top +
            ", left=" +
            left
        );
        windowObjectReference?.focus();
        window.addEventListener("message", receiveMessage, false);
      }
    }
  };

  const handleContinueClick = () => {
    setActiveStep?.(3);
  };

  const handleChangeAuth = () => {
    setEmail("");
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
    handleAuthClick();
  };

  const workflowTriggerCredentials = workflow?.trigger.credentials;

  useEffect(() => {
    if (workflowTriggerCredentials) {
      testAuth(workflowTriggerCredentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        {triggerConnector.icon && (
          <TitleIconWrapper>
            <TitleIcon
              src={triggerConnector.icon}
              alt={`${triggerConnector.name} icon`}
            />
          </TitleIconWrapper>
        )}
        <Text variant="h3" value="Set up trigger" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${triggerConnector.name}`} />
        </div>
      </TitleWrapper>
      {triggerAuthenticationIsRequired && (
        <>
          {!triggerIsAuthenticated && (
            <div style={{ margin: "30px auto 0" }}>
              <Button
                icon={triggerConnector.icon || ""}
                onClick={handleAuthClick}
                value={`Sign in to ${triggerConnector.name}`}
              />
            </div>
          )}
          {triggerIsAuthenticated && (
            <AccountWrapper>
              <Text
                value={`${triggerConnector.name} account`}
                variant="body2"
              />
              <AccountNameWrapper>
                {triggerConnector.icon && (
                  <img
                    src={triggerConnector.icon}
                    alt=""
                    style={{ marginRight: 8 }}
                  />
                )}

                <Text variant="body1" value={email || ""} />

                <div style={{ marginLeft: "auto" }}>
                  <Check />
                </div>
              </AccountNameWrapper>
              <div style={{ marginTop: 10 }}>
                <Button
                  onClick={handleChangeAuth}
                  value="Change account"
                  variant="outlined"
                />
              </div>
            </AccountWrapper>
          )}
        </>
      )}

      {triggerIsAuthenticated && (
        <div style={{ marginTop: 40 }}>
          {inputFields.map((inputField: Field) => (
            <TriggerInputField
              inputField={inputField}
              key={inputField.key}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
          {triggerIsConfigured && !loading && (
            <div style={{ marginTop: 40 }}>
              <Button onClick={handleContinueClick} value="Continue" />
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default TriggerConfiguration;
