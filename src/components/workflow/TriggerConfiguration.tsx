import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { CircularProgress, Text, AlertField } from "grindery-ui";
import Check from "./../icons/Check";
import { Field } from "../../types/Connector";
import TriggerInputField from "./TriggerInputField";
import {
  getParameterByName,
  getValidationScheme,
  jsonrpcObj,
} from "../../helpers/utils";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import ChainSelector from "./ChainSelector";
import ContractSelector from "./ContractSelector";
import useAddressBook from "../../hooks/useAddressBook";
import useAppContext from "../../hooks/useAppContext";
import { ICONS } from "../../constants";
import Button from "../shared/Button";

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

const AlertWrapper = styled.div`
  margin-top: 20px;
  transform: translateY(10px);
`;

type Props = {
  step: number;
};

const TriggerConfiguration = (props: Props) => {
  const { step } = props;
  const { user, validator } = useAppContext();
  const {
    workflow,
    updateWorkflow,
    activeStep,
    setActiveStep,
    connectors,
    setConnectors,
    loading,
    setLoading,
    triggers,
    error,
  } = useWorkflowContext();
  const [email, setEmail] = useState("");
  const [triggerError, setTriggerError] = useState("");
  const { addressBook, setAddressBook } = useAddressBook(user);
  const [errors, setErrors] = useState<any>(false);

  const inputFields =
    (triggers.current &&
      triggers.current.operation &&
      triggers.current.operation.inputFields &&
      triggers.current.operation.inputFields.filter(
        (inputField: Field) => inputField && !inputField.computed
      )) ||
    (triggers.current &&
      triggers.current.inputFields &&
      triggers.current.inputFields.filter(
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
          triggers.triggerConnector &&
          triggers.triggerConnector.authentication &&
          triggers.triggerConnector.authentication.type &&
          triggers.triggerConnector.authentication.type === "oauth2" &&
          codeParam &&
          triggers.triggerConnector.authentication.oauth2Config &&
          triggers.triggerConnector.authentication.oauth2Config.getAccessToken
        ) {
          const getAccessTokenRequest =
            triggers.triggerConnector.authentication.oauth2Config
              .getAccessToken;
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
      triggers.triggerConnector &&
      triggers.triggerConnector.authentication &&
      triggers.triggerConnector.authentication.test
    ) {
      const headers = triggers.triggerConnector.authentication.test.headers;
      const url = triggers.triggerConnector.authentication.test.url;
      const method = triggers.triggerConnector.authentication.test.method;
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
    if (triggers.triggerConnector?.authentication?.type === "oauth2") {
      window.removeEventListener("message", receiveMessage, false);
      const width = 375,
        height = 500,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;
      let windowObjectReference = window.open(
        triggers.triggerConnector.authentication?.oauth2Config?.authorizeUrl
          .url +
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
    if (triggers.current?.operation?.inputFieldProviderUrl) {
      if (workflow) {
        setLoading(true);
        axios
          .post(
            triggers.current.operation.inputFieldProviderUrl,
            jsonrpcObj("grinderyNexusConnectorUpdateFields", {
              key: triggers.current.key,
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
                    if (
                      connector &&
                      connector.key === triggers.triggerConnector?.key
                    ) {
                      return {
                        ...connector,
                        triggers: [
                          ...(connector.triggers || []).map((trig) => {
                            if (
                              trig.key === triggers.current?.key &&
                              trig.operation
                            ) {
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
    setTriggerError("");
    setErrors(true);

    const validationSchema = getValidationScheme([
      ...(triggers.current?.inputFields ||
        triggers.current?.operation?.inputFields ||
        []),
      ...(triggers.current?.operation?.type === "blockchain:event" &&
      (
        triggers.current?.operation?.inputFields ||
        triggers.current?.inputFields ||
        []
      ).filter((inputfield: Field) => inputfield.key === "_grinderyChain")
        .length < 1
        ? [
            {
              key: "_grinderyChain",
              type: "string",
              required: true,
            },
          ]
        : []),
      ...(triggers.current?.operation?.type === "blockchain:event" &&
      (
        triggers.current?.operation?.inputFields ||
        triggers.current?.inputFields ||
        []
      ).filter(
        (inputfield: Field) => inputfield.key === "_grinderyContractAddress"
      ).length < 1
        ? [
            {
              key: "_grinderyContractAddress",
              type: "string",
              required: true,
            },
          ]
        : []),
    ]);

    const check = validator.compile(validationSchema);

    const validated = check(workflow.trigger.input);

    if (typeof validated === "boolean") {
      setActiveStep(3);
    } else {
      setErrors(validated);
      setTriggerError("Please complete all required fields.");
    }

    /* if (!triggers.triggerIsConfigured) {
        setTriggerError("Please complete all required fields.");
      } else {
        setActiveStep(3);
      } */
  };

  const handleChangeAuth = () => {
    setEmail("");
    setTriggerError("");
    updateWorkflow({
      "trigger.credentials": undefined,
      "trigger.input": {},
    });
    handleAuthClick();
  };

  const handleChainChange = (value: string) => {
    setTriggerError("");
    updateWorkflow({
      "trigger.input._grinderyChain": value || "",
    });
  };

  const handleContractChange = (value: string) => {
    setTriggerError("");
    updateWorkflow({
      "trigger.input._grinderyContractAddress": value || "",
    });
  };

  const workflowTriggerCredentials = workflow.trigger.credentials;

  const setTriggerType = () => {
    if (triggers && triggers.current && triggers.current.inputFields) {
      updateWorkflow({
        "trigger.type": "recipe",
      });
    }
  };

  useEffect(() => {
    if (workflowTriggerCredentials) {
      testAuth(workflowTriggerCredentials);
    }
    setTriggerType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeStep || step !== activeStep) {
    return null;
  }

  return triggers.triggerConnector && triggers.current ? (
    <Wrapper>
      <TitleWrapper>
        {triggers.triggerConnector.icon && (
          <TitleIconWrapper>
            <TitleIcon
              src={triggers.triggerConnector.icon}
              alt={`${triggers.triggerConnector.name} icon`}
            />
          </TitleIconWrapper>
        )}
        <Text variant="h3" value="Set up trigger" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${triggers.triggerConnector.name}`} />
        </div>
      </TitleWrapper>
      {triggers.triggerAuthenticationIsRequired && (
        <>
          {!triggers.triggerIsAuthenticated && (
            <div style={{ margin: "30px auto 0" }}>
              <Button
                icon={triggers.triggerConnector.icon || ""}
                onClick={handleAuthClick}
                value={`Sign in to ${triggers.triggerConnector.name}`}
              />
            </div>
          )}
          {triggers.triggerIsAuthenticated && (
            <AccountWrapper>
              <Text
                value={`${triggers.triggerConnector.name} account`}
                variant="body2"
              />
              <AccountNameWrapper>
                {triggers.triggerConnector.icon && (
                  <img
                    src={triggers.triggerConnector.icon}
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
                  fullWidth
                />
              </div>
            </AccountWrapper>
          )}
        </>
      )}

      {triggers.triggerIsAuthenticated && (
        <div style={{ marginTop: 40 }}>
          {triggers.current.operation?.type === "blockchain:event" &&
            (
              triggers.current?.operation?.inputFields ||
              triggers.current?.inputFields ||
              []
            ).filter((inputfield: Field) => inputfield.key === "_grinderyChain")
              .length < 1 && (
              <ChainSelector
                value={(workflow.trigger.input._grinderyChain || "").toString()}
                onChange={handleChainChange}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          {triggers.current.operation?.type === "blockchain:event" &&
            (
              triggers.current?.operation?.inputFields ||
              triggers.current?.inputFields ||
              []
            ).filter(
              (inputfield: Field) =>
                inputfield.key === "_grinderyContractAddress"
            ).length < 1 && (
              <ContractSelector
                value={(
                  workflow.trigger.input._grinderyContractAddress || ""
                ).toString()}
                onChange={handleContractChange}
                options={[]}
                addressBook={addressBook}
                setAddressBook={setAddressBook}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          {inputFields.map((inputField: Field) => (
            <TriggerInputField
              inputField={inputField}
              key={inputField.key}
              setTriggerError={setTriggerError}
              addressBook={addressBook}
              setAddressBook={setAddressBook}
              errors={errors}
              setErrors={setErrors}
            />
          ))}
          {error && (
            <AlertWrapper>
              <AlertField
                color="error"
                icon={
                  <img
                    src={ICONS.ERROR_ALERT}
                    width={20}
                    height={20}
                    alt="error icon"
                  />
                }
              >
                <div style={{ textAlign: "left" }}>Error: {error}</div>
              </AlertField>
            </AlertWrapper>
          )}
          {triggerError && (
            <AlertWrapper>
              <AlertField
                color="error"
                icon={
                  <img
                    src={ICONS.ERROR_ALERT}
                    width={20}
                    height={20}
                    alt="error icon"
                  />
                }
              >
                <div style={{ textAlign: "left" }}>{triggerError}</div>
              </AlertField>
            </AlertWrapper>
          )}
          {loading && (
            <div
              style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}
            >
              <CircularProgress color="inherit" />
            </div>
          )}

          <div style={{ marginTop: 40 }}>
            <Button
              onClick={handleContinueClick}
              value="Continue"
              disabled={loading}
            />
          </div>
        </div>
      )}
    </Wrapper>
  ) : null;
};

export default TriggerConfiguration;
