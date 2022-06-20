import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress, AlertField, Text, Button } from "grindery-ui";
import { Field } from "../../types/Connector";
import ActionInputField from "./ActionInputField";
import { getOutputOptions, getParameterByName, jsonrpcObj } from "../../utils";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import ChainSelector from "./ChainSelector";
import GasInput from "./GasInput";
import { ICONS } from "../../constants";
import axios from "axios";
import Check from "../icons/Check";
import useAppContext from "../../hooks/useAppContext";
import ContractSelector from "./ContractSelector";
import useAddressBook from "../../hooks/useAddressBook";

const Wrapper = styled.div`
  padding: 20px 20px 40px;
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
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
  index: number;
  step: number;
};

const ActionConfiguration = (props: Props) => {
  const { index, step } = props;
  const { user } = useAppContext();
  const {
    action,
    trigger,
    actionConnector,
    actionIsConfigured,
    activeStep,
    triggerConnector,
    workflow,
    updateWorkflow,
    saveWorkflow,
    loading,
    error,
    setActiveStep,
    setLoading,
    connectors,
    setConnectors,
    actionAuthenticationIsRequired,
    actionIsAuthenticated,
  } = useWorkflowContext();

  const [email, setEmail] = useState("");
  const [gas, setGas] = useState("0.1");
  const { addressBook, setAddressBook } = useAddressBook(user);

  const inputFields = (action(index)?.operation?.inputFields || []).filter(
    (inputField: Field) => inputField && !inputField.computed
  );

  const options =
    triggerConnector && trigger?.operation
      ? getOutputOptions(trigger.operation, triggerConnector)
      : [];

  const handleTestClick = async () => {
    setActiveStep("actionTest");
  };

  const handleSaveClick = async () => {
    saveWorkflow();
  };

  const handleChainChange = (val: any) => {
    updateWorkflow({
      ["actions[" + index + "].input._grinderyChain"]: val?.value || "",
    });
  };

  const handleContractChange = (val: any) => {
    updateWorkflow({
      ["actions[" + index + "].input._grinderyContractAddress"]: val || "",
    });
  };

  const clearCredentials = () => {
    updateWorkflow({
      "trigger.credentials": undefined,
    });
  };

  const receiveMessage = (e: any) => {
    if (e.origin === window.location.origin) {
      const { data } = e;

      if (data.gr_url) {
        const codeParam = getParameterByName("code", data.gr_url);

        if (
          actionConnector(index)?.authentication &&
          actionConnector(index)?.authentication?.type &&
          actionConnector(index)?.authentication?.type === "oauth2" &&
          codeParam &&
          actionConnector(index)?.authentication?.oauth2Config &&
          actionConnector(index)?.authentication?.oauth2Config?.getAccessToken
        ) {
          const getAccessTokenRequest =
            actionConnector(index)?.authentication?.oauth2Config
              ?.getAccessToken;

          if (getAccessTokenRequest) {
            const body =
              typeof getAccessTokenRequest.body === "object"
                ? getAccessTokenRequest.body
                : {};
            axios({
              method: getAccessTokenRequest.method,
              url: getAccessTokenRequest.url,
              headers: getAccessTokenRequest.headers || {},
              data: {
                ...body,
                code: codeParam,
                redirect_uri: window.location.origin + "/auth",
              },
            })
              .then((res) => {
                if (res && res.data) {
                  const credentials = res.data;
                  testAuth(credentials);
                }
              })
              .catch((err) => {
                console.log("getAccessTokenRequest err", err);
              });
          }
        }

        e.source.postMessage({ gr_close: true }, window.location.origin);
        window.removeEventListener("message", receiveMessage, false);
      }
    }
  };

  const testAuth = (credentials: any) => {
    if (
      actionConnector &&
      actionConnector(index) &&
      actionConnector(index)?.authentication &&
      actionConnector(index)?.authentication?.test &&
      actionConnector(index)?.authentication?.test.url
    ) {
      const headers = actionConnector(index)?.authentication?.test.headers;
      const url = actionConnector(index)?.authentication?.test.url || "";
      const method = actionConnector(index)?.authentication?.test.method;
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
            updateWorkflow({
              ["actions[" + index + "].credentials"]: credentials,
            });
            updateFieldsDefinition();
          }
        })
        .catch((err) => {
          clearCredentials();
          setEmail("");
        });
    }
  };

  const handleAuthClick = () => {
    if (actionConnector(index)?.authentication?.type === "oauth2") {
      window.removeEventListener("message", receiveMessage, false);
      const width = 375,
        height = 500,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;
      let windowObjectReference = window.open(
        actionConnector(index)?.authentication?.oauth2Config?.authorizeUrl.url +
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
    if (action(index)?.operation?.inputFieldProviderUrl) {
      if (workflow) {
        setLoading(true);
        axios
          .post(
            action(index)?.operation?.inputFieldProviderUrl || "",
            jsonrpcObj("grinderyNexusConnectorUpdateFields", {
              key: action(index)?.key,
              fieldData: {},
              credentials: workflow.actions[index].credentials,
            })
          )
          .then((res) => {
            if (res && res.data && res.data.error) {
              console.log(
                "grinderyNexusConnectorUpdateFields error",
                res.data.error
              );
            }
            if (res && res.data && res.data.result) {
              if (res.data.result.inputFields && connectors) {
                setConnectors([
                  ...connectors.map((connector) => {
                    if (
                      connector &&
                      connector.key === actionConnector(index)?.key
                    ) {
                      return {
                        ...connector,
                        actions: [
                          ...(connector.actions || []).map((act) => {
                            if (
                              act.key === action(index)?.key &&
                              act.operation
                            ) {
                              return {
                                ...act,
                                operation: {
                                  ...act.operation,
                                  inputFields:
                                    res.data.result.inputFields ||
                                    act.operation.inputFields,
                                  outputFields:
                                    res.data.result.outputFields ||
                                    act.operation.outputFields ||
                                    [],
                                  sample:
                                    res.data.result.sample ||
                                    act.operation.sample ||
                                    {},
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
            console.log("grinderyNexusConnectorUpdateFields error", err);
            setLoading(false);
          });
      }
    }
  };

  const handleChangeAuth = () => {
    setEmail("");
    updateWorkflow({
      "trigger.credentials": undefined,
    });
    handleAuthClick();
  };

  const workflowActionCredentials = workflow.actions[index].credentials;

  const handleGasChange = (value: string) => {
    updateWorkflow({
      ["actions[" + index + "].input._grinderyGasLimit"]: value,
    });
  };

  const operationType = action(index)?.operation?.type;

  useEffect(() => {
    if (workflowActionCredentials) {
      testAuth(workflowActionCredentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (operationType === "blockchain:call") {
      handleGasChange(gas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationType, gas]);

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        {actionConnector(index)?.icon && (
          <TitleIconWrapper>
            <TitleIcon
              src={actionConnector(index)?.icon}
              alt={`${actionConnector(index)?.name} icon`}
            />
          </TitleIconWrapper>
        )}
        <Text variant="h3" value="Set up Action" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${actionConnector(index)?.name}`} />
        </div>
      </TitleWrapper>

      {action(index)?.operation?.type === "blockchain:call" && (
        <AlertField
          color="warning"
          icon={
            <img src={ICONS.GAS_ALERT} width={20} height={20} alt="gas icon" />
          }
        >
          <>
            <div style={{ textAlign: "left" }}>
              This action will require you to pay gas. Make sure your account
              has funds. Current balance:{" "}
              <a
                href="#balance"
                style={{
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "underline",
                }}
              >
                0.003 ETH
              </a>
            </div>
            <GasInput
              value={gas}
              onChange={(e) => {
                setGas(e.target.value);
              }}
            />
          </>
        </AlertField>
      )}

      {actionAuthenticationIsRequired(index) && (
        <>
          {!actionIsAuthenticated(index) && (
            <div style={{ margin: "30px auto 0" }}>
              <Button
                icon={actionConnector(index)?.icon || ""}
                onClick={handleAuthClick}
                value={`Sign in to ${actionConnector(index)?.name}`}
              />
            </div>
          )}
          {actionIsAuthenticated(index) && (
            <AccountWrapper>
              <Text
                value={`${actionConnector(index)?.name} account`}
                variant="body2"
              />
              <AccountNameWrapper>
                {actionConnector(index)?.icon && (
                  <img
                    src={actionConnector(index)?.icon}
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

      {actionIsAuthenticated(index) && (
        <div>
          {action(index)?.operation?.type === "blockchain:call" && (
            <ChainSelector
              value={workflow.actions[index].input._grinderyChain || ""}
              onChange={handleChainChange}
            />
          )}
          {action(index)?.operation?.type === "blockchain:call" && (
            <ContractSelector
              value={
                workflow.actions[index].input._grinderyContractAddress || ""
              }
              onChange={handleContractChange}
              options={options}
              addressBook={addressBook}
              setAddressBook={setAddressBook}
            />
          )}
          {inputFields.map((inputField: Field) => (
            <ActionInputField
              key={inputField.key}
              inputField={inputField}
              options={options}
              index={index}
              addressBook={addressBook}
              setAddressBook={setAddressBook}
            />
          ))}
          {loading && (
            <div
              style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}
            >
              <CircularProgress color="inherit" />
            </div>
          )}
          {error && (
            <div
              style={{ marginTop: 40, textAlign: "center", color: "#FF5858" }}
            >
              Error: {error}
            </div>
          )}
          {actionIsConfigured(index) && (
            <div style={{ marginTop: 30 }}>
              {action(index)?.operation?.type !== "blockchain:call" ? (
                <Button
                  onClick={handleTestClick}
                  value="Test & Continue"
                  color="primary"
                  disabled={loading}
                />
              ) : (
                <Button
                  onClick={handleSaveClick}
                  value="Save & Close"
                  color="primary"
                  disabled={loading}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default ActionConfiguration;
