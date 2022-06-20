import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { CircularProgress, Text, Button } from "grindery-ui";
import Check from "./../icons/Check";
import { Field } from "../../types/Connector";
import TriggerInputField from "./TriggerInputField";
import { getParameterByName, jsonrpcObj } from "../../utils";
import { useWorkflowContext } from "../../context/WorkflowContext";
import ChainSelector from "./ChainSelector";
import ContractSelector from "./ContractSelector";
import useAddressBook from "../../hooks/useAddressBook";
import { useAppContext } from "../../context/AppContext";

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
  step: number;
};

const TriggerConfiguration = (props: Props) => {
  const { step } = props;
  const { user } = useAppContext();
  const {
    workflow,
    updateWorkflow,
    trigger,
    triggerAuthenticationIsRequired,
    triggerIsAuthenticated,
    triggerConnector,
    activeStep,
    setActiveStep,
    triggerIsConfigured,
    connectors,
    setConnectors,
    loading,
    setLoading,
  } = useWorkflowContext();
  const [email, setEmail] = useState("");

  const { addressBook, setAddressBook } = useAddressBook(user);

  const inputFields =
    (trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields.filter(
        (inputField: Field) => inputField && !inputField.computed
      )) ||
    [];

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
      if (url) {
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
                "trigger.credentials": credentials,
              });
              updateFieldsDefinition();
            }
          })
          .catch((err) => {
            clearCredentials();
            setEmail("");
          });
      }
    }
  };

  const handleAuthClick = () => {
    if (triggerConnector?.authentication?.type === "oauth2") {
      window.removeEventListener("message", receiveMessage, false);
      const width = 375,
        height = 500,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;
      let windowObjectReference = window.open(
        triggerConnector?.authentication?.oauth2Config?.authorizeUrl.url +
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
    if (trigger?.operation?.inputFieldProviderUrl) {
      if (workflow) {
        setLoading(true);
        axios
          .post(
            trigger.operation.inputFieldProviderUrl,
            jsonrpcObj("grinderyNexusConnectorUpdateFields", {
              key: trigger.key,
              fieldData: {},
              credentials: workflow.trigger.credentials,
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
                    if (connector && connector.key === triggerConnector?.key) {
                      return {
                        ...connector,
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (trig.key === trigger.key && trig.operation) {
                              return {
                                ...trig,
                                operation: {
                                  ...trig.operation,
                                  inputFields:
                                    res.data.result.inputFields ||
                                    trig.operation.inputFields,
                                  outputFields:
                                    res.data.result.outputFields ||
                                    trig.operation.outputFields ||
                                    [],
                                  sample:
                                    res.data.result.sample ||
                                    trig.operation.sample ||
                                    {},
                                },
                              };
                            } else {
                              return trig;
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

  const handleContinueClick = () => {
    setActiveStep(3);
  };

  const handleChangeAuth = () => {
    setEmail("");
    updateWorkflow({
      "trigger.credentials": undefined,
      "trigger.input": {},
    });
    handleAuthClick();
  };

  const handleChainChange = (val: any) => {
    updateWorkflow({
      "trigger.input._grinderyChain": val?.value || "",
    });
  };

  const handleContractChange = (val: any) => {
    updateWorkflow({
      "trigger.input._grinderyContractAddress": val || "",
    });
  };

  const workflowTriggerCredentials = workflow.trigger.credentials;

  useEffect(() => {
    if (workflowTriggerCredentials) {
      testAuth(workflowTriggerCredentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return triggerConnector && trigger ? (
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
          {trigger.operation?.type === "blockchain:event" && (
            <ChainSelector
              value={workflow.trigger.input._grinderyChain || ""}
              onChange={handleChainChange}
            />
          )}
          {trigger.operation?.type === "blockchain:event" && (
            <ContractSelector
              value={workflow.trigger.input._grinderyContractAddress || ""}
              onChange={handleContractChange}
              options={[]}
              addressBook={addressBook}
              setAddressBook={setAddressBook}
            />
          )}
          {inputFields.map((inputField: Field) => (
            <TriggerInputField inputField={inputField} key={inputField.key} />
          ))}
          {loading && (
            <div
              style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}
            >
              <CircularProgress color="inherit" />
            </div>
          )}
          {triggerIsConfigured && !loading && (
            <div style={{ marginTop: 40 }}>
              <Button onClick={handleContinueClick} value="Continue" />
            </div>
          )}
        </div>
      )}
    </Wrapper>
  ) : null;
};

export default TriggerConfiguration;
