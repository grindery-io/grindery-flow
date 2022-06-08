import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, ButtonElement, SelectInput } from "grindery-ui";
import { useAppContext } from "../context/AppContext";
import Check from "./icons/Check";

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
    isTriggerAuthenticationRequired,
    triggerIsAuthenticated,
    triggerConnector,
    activeStep,
    setActiveStep,
    triggerIsConfigured,
  } = useAppContext();
  const [email, setEmail] = useState("");

  const clearCredentials = () => {
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
  };

  const receiveMessage = (e: { origin: any; data: any }) => {
    if (e.origin === window.location.origin) {
      const { data } = e;
      if (data.g_url) {
        const urlArray = data.g_url.split("#");
        if (urlArray[1]) {
          const hash = urlArray[1].split("&");
          const params = Object.fromEntries(
            hash
              .map((h: any) => {
                if (h) {
                  const param = h.split("=");
                  const key = param[0];
                  const val = param[1];
                  return [key, val];
                }
                return null;
              })
              .filter((entry: any) => entry)
          );
          setAuthCredentials(params);
        }
      }
    }
  };

  const setAuthCredentials = (params: any) => {
    if (triggerAuthenticationFields && triggerAuthenticationFields.length > 0) {
      const credentials = Object.fromEntries(
        triggerAuthenticationFields.map((field) => [field, params[field] || ""])
      );
      window.removeEventListener("message", receiveMessage);
      testAuth(credentials);
    }
  };

  const testAuth = (credentials: any) => {
    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        obj[key] = obj[key].replace(
          /\{\{(.+?)\}\}/g,
          (m: any, inputField: any) =>
            (inputField && credentials && credentials[inputField]) || inputField
        );
        if (typeof obj[key] === "object" && obj[key] !== null) {
          iterate(obj[key]);
        }
      });
      return obj;
    };
    if (
      triggerConnector &&
      triggerConnector.authentication &&
      triggerConnector.authentication.test
    ) {
      const headers = iterate(triggerConnector.authentication.test.headers);
      axios({
        method: triggerConnector.authentication.test.method,
        url: triggerConnector.authentication.test.url,
        headers: headers,
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
        openNewTab(
          triggerConnector.authentication.oauth2Config.authorizeUrl.url +
            "&redirect_uri=" +
            window.location.origin +
            "/auth"
        );
      }
    }
  };

  const handleFieldChange = (
    e: any,
    inputField: {
      key: any;
    }
  ) => {
    updateWorkflow?.({
      ["trigger.input." + inputField.key]: e.target.value?.value || "",
    });
  };

  const handleContinueClick = () => {
    setActiveStep?.(3);
  };

  const handleChangeAuth = () => {
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
    handleAuthClick();
  };

  const openNewTab = (url: string) => {
    window.removeEventListener("message", receiveMessage);
    const width = 375,
      height = 500,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;
    let windowObjectReference = window.open(
      url,
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
    window.addEventListener("message", (event) => receiveMessage(event), false);
  };

  const workflowTriggerCredentials = workflow?.trigger.credentials;

  useEffect(() => {
    if (workflowTriggerCredentials) {
      testAuth(workflowTriggerCredentials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = () => {
    setActiveStep?.(2);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return null;
  }

  if (step > activeStep) {
    return null;
  }

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      {triggerConnector.icon && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: 8,
              background: "#FFFFFF",
              border: "1px solid #DCDCDC",
              borderRadius: 5,
              margin: "20px auto 10px",
            }}
          >
            <img
              src={triggerConnector.icon}
              alt={`${triggerConnector.name} icon`}
              style={{ display: "block", width: 24, height: 24 }}
            />
          </div>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <Text variant="h3" value="Set up trigger" />
        <div style={{ marginTop: 4 }}>
          <Text variant="p" value={`for ${triggerConnector.name}`} />
        </div>
      </div>
      {isTriggerAuthenticationRequired && (
        <>
          {!triggerIsAuthenticated && (
            <div style={{ margin: "30px auto 0" }}>
              <ButtonElement
                icon={triggerConnector.icon || ""}
                onClick={handleAuthClick}
                value={`Sign in to ${triggerConnector.name}`}
              />
            </div>
          )}
          {triggerIsAuthenticated && (
            <div
              style={{
                marginTop: 40,
                textAlign: "left",
                marginBottom: 40,
              }}
            >
              <Text
                value={`${triggerConnector.name} account`}
                variant="body2"
              />
              <div
                style={{
                  padding: "15px 0",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "nowrap",
                }}
              >
                {triggerConnector.icon && (
                  <img
                    src={triggerConnector.icon}
                    alt=""
                    style={{ marginRight: 8 }}
                  />
                )}

                <Text variant="body1" value={<strong>{email || ""}</strong>} />

                <div style={{ marginLeft: "auto" }}>
                  <Check />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <ButtonElement
                  onClick={handleChangeAuth}
                  value="Change account"
                  variant="outlined"
                />
              </div>
            </div>
          )}
        </>
      )}

      {triggerIsAuthenticated && (
        <div>
          {trigger &&
            trigger.operation &&
            trigger.operation.inputFields &&
            trigger.operation.inputFields
              .filter(
                (inputField: { computed: any }) =>
                  inputField && !inputField.computed
              )
              .map(
                (inputField: {
                  label: any;
                  key: any;
                  placeholder: any;
                  type: any;
                  required: any;
                  choices?: any[];
                }) => (
                  <React.Fragment key={inputField.key}>
                    {!!inputField && (
                      <div
                        style={{
                          width: "100%",
                          marginTop: 20,
                        }}
                      >
                        <SelectInput
                          label={inputField.label}
                          type="default"
                          placeholder={inputField.placeholder}
                          onChange={(e: any) => {
                            handleFieldChange(e, inputField);
                          }}
                          options={inputField.choices?.map((choice) => ({
                            value: choice.value,
                            label: choice.label,
                            icon: triggerConnector.icon || "",
                          }))}
                          value={
                            (workflow?.trigger &&
                              workflow?.trigger.input &&
                              workflow?.trigger.input[inputField.key] &&
                              workflow?.trigger.input[
                                inputField.key
                              ].toString()) ||
                            ""
                          }
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
          {triggerIsConfigured && (
            <div style={{ marginTop: 40 }}>
              <ButtonElement onClick={handleContinueClick} value="Continue" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TriggerConfiguration;
