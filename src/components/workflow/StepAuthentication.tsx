import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { CircularProgress, Autocomplete } from "grindery-ui";
import { ICONS, isLocalOrStaging } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { default as NexusButton } from "../shared/Button";
import {
  getParameterByName,
  jsonrpcObj,
  replaceTokens,
} from "../../helpers/utils";
import useAppContext from "../../hooks/useAppContext";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";

const AUTH_ENDPOINT = "https://orchestrator.grindery.org/credentials/staging";
const GET_OAUTH_TOKEN_ENDPOINT =
  "https://orchestrator.grindery.org/credentials/auth/complete";

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
  position: relative;
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
  margin-top: 0px;
  text-align: left;
  margin-bottom: 6px;

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

type Props = {};

const StepAuthentication = (props: Props) => {
  const {
    type,
    step,
    activeRow,
    username,
    connector,
    operation,
    operationAuthenticationIsRequired,
    operationIsAuthenticated,
    savedCredentials,
    setActiveRow,
    setUsername,
    setConnector,
    setOperationIsTested,
    setSavedCredentials,
  } = useWorkflowStepContext();
  const { workflow, updateWorkflow, loading, setLoading } =
    useWorkflowContext();
  const { client, access_token } = useAppContext();

  const index = step - 2;

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
          connector &&
          connector.authentication &&
          connector.authentication.type &&
          connector.authentication.type === "oauth2" &&
          codeParam
        ) {
          const data = {
            code: codeParam,
            //redirect_uri: window.location.origin + "/auth",
          };
          axios({
            method: "POST",
            url: GET_OAUTH_TOKEN_ENDPOINT,
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data,
          })
            .then((res) => {
              if (res && res.data) {
                const credentials = res.data;
                if (isLocalOrStaging) {
                  console.log("credentials", credentials);
                }

                testAuth(credentials, true);
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
    setOperationIsTested(false);
    if (connector?.authentication?.type === "oauth2") {
      window.removeEventListener("message", receiveMessage, false);
      const width = 375,
        height = 500,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;

      let windowObjectReference = window.open(
        `${AUTH_ENDPOINT}/${connector.key}/auth?access_token=${access_token}&redirect_uri=${window.location.origin}/auth`,
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
    if (operation?.operation?.inputFieldProviderUrl) {
      if (workflow) {
        setLoading(true);
        client
          ?.callInputProvider(
            connector?.key || "",
            operation.key,
            jsonrpcObj("grinderyNexusConnectorUpdateFields", {
              key: operation.key,
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
              if (res.inputFields && connector) {
                setConnector({
                  ...connector,
                  triggers: [
                    ...(connector.triggers || []).map((trig) => {
                      if (trig.key === operation?.key && trig.operation) {
                        return {
                          ...trig,
                          operation: {
                            ...trig.operation,
                            inputFields:
                              res.inputFields || trig.operation.inputFields,
                            outputFields:
                              res.outputFields ||
                              trig.operation.outputFields ||
                              [],
                            sample: res.sample || trig.operation.sample || {},
                          },
                        };
                      } else {
                        return trig;
                      }
                    }),
                  ],
                  actions: [
                    ...(connector.actions || []).map((act) => {
                      if (act.key === operation?.key && act.operation) {
                        return {
                          ...act,
                          operation: {
                            ...act.operation,
                            inputFields:
                              res.inputFields || act.operation.inputFields,
                            outputFields:
                              res.outputFields ||
                              act.operation.outputFields ||
                              [],
                            sample: res.sample || act.operation.sample || {},
                          },
                        };
                      } else {
                        return act;
                      }
                    }),
                  ],
                });
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

  const testAuth = (credentials: any, add?: boolean) => {
    if (
      connector &&
      connector.authentication &&
      connector.authentication.test
    ) {
      const url = `https://orchestrator.grindery.org/credentials/${
        connector.key
      }/request/${(connector.authentication.test.url || "").replace(
        /^https?:\/\//,
        ""
      )}`;
      const method = connector.authentication.test.method;
      const data = {};
      const headers = replaceTokens(
        connector.authentication.authenticatedRequestTemplate?.headers || {},
        {
          auth: {
            ...credentials,
            access_token: credentials._grinderyCredentialToken,
          },
        }
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
              const account = replaceTokens(
                connector.authentication?.defaultDisplayName || "",
                { data: res.data }
              );
              setUsername(
                account ||
                  res.data.email ||
                  res.data.sub ||
                  res.data.name ||
                  res.data.username ||
                  (res.data.team && res.data.team.name) ||
                  (res.data.profile && res.data.profile.real_name) ||
                  "Unknown username"
              );
              if (
                add &&
                !savedCredentials.find(
                  (cred: any) =>
                    cred.token === credentials._grinderyCredentialToken
                )
              ) {
                setSavedCredentials((_savedCredentials) => [
                  {
                    key: "new",
                    name: account,
                    token: credentials._grinderyCredentialToken,
                  },
                  ..._savedCredentials,
                ]);
              }

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
          .catch((err: any) => {
            clearCredentials();
            setUsername("");
          });
      }
    }
  };

  const handleCredentialsChange = (value: string) => {
    if (type === "trigger") {
      updateWorkflow({
        "trigger.credentials": value
          ? {
              _grinderyCredentialToken: value,
            }
          : undefined,
        "trigger.input": {},
      });
    } else {
      updateWorkflow({
        ["actions[" + index + "].credentials"]: value
          ? {
              _grinderyCredentialToken: value,
            }
          : undefined,
        ["actions[" + index + "].input"]: {},
      });
    }
    setOperationIsTested(false);
    updateFieldsDefinition();
  };

  useEffect(() => {
    if (!operationAuthenticationIsRequired && activeRow === 1) {
      setActiveRow(activeRow + 1);
    }
  }, [activeRow, operationAuthenticationIsRequired]);

  useEffect(() => {
    if (credentials) {
      testAuth(credentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(
    "savedCredentials",
    savedCredentials.map((cred) => cred.token)
  );

  return operation && operationAuthenticationIsRequired ? (
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
          src={
            operationIsAuthenticated ? ICONS.CHECK_CIRCLE : ICONS.EXCLAMATION
          }
          alt=""
        />
      </Header>
      {activeRow === 1 && (
        <Content>
          <>
            {savedCredentials.length < 1 ? (
              <NexusButton
                fullWidth
                icon={connector?.icon || ""}
                onClick={handleAuthClick}
                value={`Sign in to ${connector?.name}`}
              />
            ) : (
              <>
                <Autocomplete
                  label={`${connector?.name} account`}
                  size="full"
                  placeholder="Select account"
                  onChange={handleCredentialsChange}
                  options={savedCredentials.map((cred: any) => ({
                    label: cred.name,
                    value: cred.token,
                    icon: connector?.icon,
                  }))}
                  value={credentials?._grinderyCredentialToken || ""}
                  button
                  buttonText="Add account"
                  onButtonClick={handleAuthClick}
                />
              </>
            )}
          </>

          {operationIsAuthenticated && (
            <>
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "32px",
                    left: 0,
                    textAlign: "center",
                    color: "#8C30F5",
                    width: "100%",
                  }}
                >
                  <CircularProgress color="inherit" />
                </div>
              )}
              <ButtonWrapper>
                <Button
                  disabled={!operationIsAuthenticated}
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
