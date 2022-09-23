import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import styled from "styled-components";
import { Text, CircularProgress } from "grindery-ui";
import { ICONS, isLocalOrStaging } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { default as NexusButton } from "../shared/Button";
import {
  getParameterByName,
  jsonrpcObj,
  replaceTokens,
} from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import Check from "./../icons/Check";

const Container = styled.div`
  border-top: 1px solid #dcdcdc;
`;

const Header = styled.div`
    padding: 12px 32px; 12px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 16px;
    cursor: pointer;

    & span {
        font-weight: 700;
        font-size: 16px;
        line-height: 120%;
        color: #0B0D17;
    }

    &.active {
      cursor: default;
    }
    &:not(.active):hover {
      background: #F4F5F7;
    }
`;

const OperationStateIcon = styled.img`
  display: block;
  margin-left: auto;
`;

const Content = styled.div`
  padding: 20px 32px;
`;

const Button = styled.button`
  box-shadow: none;
  background: #0b0d17;
  border-radius: 5px;
  border: 1px solid #0b0d17;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }

  &:disabled {
    background: #dcdcdc;
    color: #706e6e;
    border-color: #dcdcdc;
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div`
  text-align: right;
  padding-bottom: 12px;
`;

const AccountWrapper = styled.div`
  margin-top: 40px;
  text-align: left;
  margin-bottom: 40px;

  & .MuiButton-root {
    width: 100%;
  }
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
  type: "trigger" | "action";
  step: number;
  activeRow: number;
  setActiveRow: (row: number) => void;
  username: string;
  setUsername: (name: string) => void;
};

const StepAuthentication = (props: Props) => {
  const { type, step, activeRow, setActiveRow, username, setUsername } = props;
  const {
    workflow,
    activeStep,
    updateWorkflow,
    setActiveStep,
    triggers,
    actions,
    connectors,
    setConnectors,
    loading,
    setLoading,
  } = useWorkflowContext();
  const { client } = useAppContext();

  const index = step - 2;

  const isAuthenticationRequired =
    type === "trigger"
      ? triggers.triggerAuthenticationIsRequired
      : actions.actionAuthenticationIsRequired(index);

  const isAuthenticated =
    type === "trigger"
      ? triggers.triggerIsAuthenticated
      : actions.actionIsAuthenticated(index);

  const currentConnector =
    type === "trigger"
      ? connectors.find(
          (connector) => connector.key === workflow.trigger.connector
        )
      : connectors.find(
          (connector) => connector.key === workflow.actions[index].connector
        );

  const currentOperation =
    type === "trigger"
      ? currentConnector?.triggers?.find(
          (trigger) => trigger.key === workflow.trigger.operation
        )
      : currentConnector?.actions?.find(
          (action) => action.key === workflow.actions[index].operation
        );

  const credentials =
    type === "trigger"
      ? workflow.trigger.credentials
      : workflow.actions[index].credentials;

  const handleContinueClick = () => {
    setActiveRow(activeRow + 1);
  };

  const handleHeaderClick = () => {
    setActiveRow(1);
  };

  const receiveMessage = (e: any) => {
    if (e.origin === window.location.origin) {
      const { data } = e;

      if (data.gr_url) {
        const codeParam = getParameterByName("code", data.gr_url);

        if (
          currentConnector &&
          currentConnector.authentication &&
          currentConnector.authentication.type &&
          currentConnector.authentication.type === "oauth2" &&
          codeParam &&
          currentConnector.authentication.oauth2Config &&
          currentConnector.authentication.oauth2Config.getAccessToken
        ) {
          const getAccessTokenRequest =
            currentConnector.authentication.oauth2Config.getAccessToken;
          const body =
            typeof getAccessTokenRequest.body === "object"
              ? getAccessTokenRequest.body
              : {};
          const data = {
            ...body,
            code: codeParam,
            redirect_uri: window.location.origin + "/auth",
          };
          axios({
            method: getAccessTokenRequest.method,
            url: getAccessTokenRequest.url,
            headers: getAccessTokenRequest.headers || {},
            data:
              getAccessTokenRequest.headers &&
              getAccessTokenRequest.headers["Content-Type"] &&
              getAccessTokenRequest.headers["Content-Type"] ===
                "application/x-www-form-urlencoded"
                ? qs.stringify(data)
                : data,
          })
            .then((res) => {
              if (res && res.data) {
                const credentials = res.data;
                testAuth(credentials);
              }
            })
            .catch((err) => {
              console.error("getAccessTokenRequest err", err);
            });
        }

        e.source.postMessage({ gr_close: true }, window.location.origin);
        window.removeEventListener("message", receiveMessage, false);
      }
    }
  };

  const handleAuthClick = () => {
    if (currentConnector?.authentication?.type === "oauth2") {
      window.removeEventListener("message", receiveMessage, false);
      const width = 375,
        height = 500,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;
      let windowObjectReference = window.open(
        currentConnector.authentication?.oauth2Config?.authorizeUrl.url +
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
  };

  const updateFieldsDefinition = () => {
    if (currentOperation?.operation?.inputFieldProviderUrl) {
      if (workflow) {
        setLoading(true);
        client
          ?.callInputProvider(
            currentConnector?.key || "",
            currentOperation.key,
            jsonrpcObj("grinderyNexusConnectorUpdateFields", {
              key: currentOperation.key,
              fieldData: {},
              credentials: credentials,
            }),
            isLocalOrStaging ? "staging" : undefined
          )
          .then((res) => {
            if (res && res.data && res.data.error) {
              console.error(
                "grinderyNexusConnectorUpdateFields error",
                res.data.error
              );
            }
            if (res) {
              if (res.inputFields && connectors) {
                setConnectors([
                  ...connectors.map((connector) => {
                    if (connector && connector.key === currentConnector?.key) {
                      return {
                        ...connector,
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (
                              trig.key === currentOperation?.key &&
                              trig.operation
                            ) {
                              return {
                                ...trig,
                                operation: {
                                  ...trig.operation,
                                  inputFields:
                                    res.inputFields ||
                                    trig.operation.inputFields,
                                  outputFields:
                                    res.outputFields ||
                                    trig.operation.outputFields ||
                                    [],
                                  sample:
                                    res.sample || trig.operation.sample || {},
                                },
                              };
                            } else {
                              return trig;
                            }
                          }),
                        ],
                        actions: [
                          ...(connector.actions || []).map((act) => {
                            if (
                              act.key === currentOperation?.key &&
                              act.operation
                            ) {
                              return {
                                ...act,
                                operation: {
                                  ...act.operation,
                                  inputFields:
                                    res.inputFields ||
                                    act.operation.inputFields,
                                  outputFields:
                                    res.outputFields ||
                                    act.operation.outputFields ||
                                    [],
                                  sample:
                                    res.sample || act.operation.sample || {},
                                },
                              };
                            } else {
                              return act;
                            }
                          }),
                        ],
                      };
                    } else {
                      return connector;
                    }
                  }),
                ]);
              }
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("grinderyNexusConnectorUpdateFields error", err);
            setLoading(false);
          });
      }
    }
  };

  const clearCredentials = () => {
    if (type === "trigger") {
      updateWorkflow({
        "trigger.credentials": undefined,
      });
    } else {
      updateWorkflow({
        ["actions[" + index + "].credentials"]: undefined,
      });
    }
  };

  const testAuth = (credentials: any) => {
    if (
      currentConnector &&
      currentConnector.authentication &&
      currentConnector.authentication.test
    ) {
      const url = currentConnector.authentication.test.url;
      const method = currentConnector.authentication.test.method;
      const data = replaceTokens(
        currentConnector.authentication?.test.body || {},
        credentials
      );
      const headers = replaceTokens(
        currentConnector.authentication.test.headers || {},
        credentials
      );
      if (url) {
        axios({
          method: method,
          url: url,
          headers,
          data,
        })
          .then((res) => {
            if (res && res.data) {
              setUsername(
                res.data.email ||
                  res.data.sub ||
                  res.data.name ||
                  res.data.username ||
                  (res.data.team && res.data.team.name) ||
                  (res.data.profile && res.data.profile.real_name) ||
                  "Unknown username"
              );
              if (type === "trigger") {
                updateWorkflow({
                  "trigger.credentials": credentials,
                });
              } else {
                updateWorkflow({
                  ["actions[" + index + "].credentials"]: credentials,
                });
              }
              updateFieldsDefinition();
            }
          })
          .catch((err) => {
            clearCredentials();
            setUsername("");
          });
      }
    }
  };

  const handleChangeAuth = () => {
    setUsername("");
    if (type === "trigger") {
      updateWorkflow({
        "trigger.credentials": undefined,
        "trigger.input": {},
      });
    } else {
      updateWorkflow({
        ["actions[" + index + "].credentials"]: undefined,
        ["actions[" + index + "].input"]: {},
      });
    }
    handleAuthClick();
  };

  useEffect(() => {
    if (!isAuthenticationRequired && activeRow === 1) {
      setActiveRow(activeRow + 1);
    }
  }, [activeRow, isAuthenticationRequired]);

  useEffect(() => {
    if (credentials) {
      testAuth(credentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentOperation && isAuthenticationRequired ? (
    <Container>
      <Header
        className={activeRow === 1 ? "active" : ""}
        onClick={handleHeaderClick}
      >
        {activeRow === 1 ? (
          <img src={ICONS.ANGLE_UP} alt="" />
        ) : (
          <img src={ICONS.ANGLE_DOWN} alt="" />
        )}
        <span>Choose account</span>

        <OperationStateIcon
          src={isAuthenticated ? ICONS.CHECK_CIRCLE : ICONS.EXCLAMATION}
          alt=""
        />
      </Header>
      {activeRow === 1 && (
        <Content>
          {!isAuthenticated && (
            <NexusButton
              fullWidth
              icon={currentConnector?.icon || ""}
              onClick={handleAuthClick}
              value={`Sign in to ${currentConnector?.name}`}
            />
          )}
          {isAuthenticated && (
            <>
              <AccountWrapper>
                <Text
                  value={`${currentConnector?.name} account`}
                  variant="body2"
                />
                <AccountNameWrapper>
                  {currentConnector?.icon && (
                    <img
                      src={currentConnector.icon}
                      alt=""
                      style={{ marginRight: 8 }}
                    />
                  )}

                  <Text variant="body1" value={username || ""} />

                  <div style={{ marginLeft: "auto" }}>
                    <Check />
                  </div>
                </AccountNameWrapper>
                <div style={{ marginTop: 10 }}>
                  <NexusButton
                    onClick={handleChangeAuth}
                    value="Change account"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              </AccountWrapper>
              {loading && (
                <div
                  style={{
                    marginTop: 30,
                    textAlign: "center",
                    color: "#8C30F5",
                  }}
                >
                  <CircularProgress color="inherit" />
                </div>
              )}
              <ButtonWrapper>
                <Button
                  disabled={!isAuthenticated}
                  onClick={handleContinueClick}
                >
                  Continue
                </Button>
              </ButtonWrapper>
            </>
          )}
        </Content>
      )}
    </Container>
  ) : null;
};

export default StepAuthentication;
