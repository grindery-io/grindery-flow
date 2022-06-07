import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

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
  } = useAppContext();
  const [email, setEmail] = useState("");
  const [formFields, setFormFields] = useState(
    Object.fromEntries(
      trigger &&
        trigger.operation &&
        trigger.operation.inputFields &&
        trigger.operation.inputFields
          .filter(
            (inputField: { computed: any }) =>
              inputField && !inputField.computed
          )
          .map((field: { key: any }) => [
            "trigger.input." + field.key,
            workflow?.trigger.input[field.key] || "",
          ])
    )
  );

  const clearCredentials = () => {
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
  };

  const setAuthCredentials = (params: any) => {
    if (triggerAuthenticationFields && triggerAuthenticationFields.length > 0) {
      const credentials = Object.fromEntries(
        triggerAuthenticationFields.map((field) => [field, params[field] || ""])
      );
      console.log("credentials", credentials);
      testAuth(credentials);
    }
  };

  const testAuth = (credentials: any) => {
    console.log("testAuth credentials", credentials);

    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        obj[key] = obj[key].replace(
          /\{\{(.+?)\}\}/g,
          (m: any, inputField: any) => {
            console.log("inputField", inputField);
            console.log("credentials[inputField]", credentials[inputField]);
            return (
              (inputField && credentials && credentials[inputField]) ||
              inputField
            );
          }
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
      console.log("headers", headers);

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
        //window.location.href = triggerConnector.authentication.oauth2Config.authorizeUrl.url + "&redirect_uri=http://localhost:3000";
      }
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    inputField: {
      key: any;
    }
  ) => {
    setFormFields({
      ...formFields,
      ["trigger.input." + inputField.key]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkflow?.(formFields);
    setActiveStep?.(3);
  };

  const handleChangeAuth = () => {
    updateWorkflow?.({
      "trigger.credentials": undefined,
    });
    handleAuthClick();
  };

  let windowObjectReference = null;

  const receiveMessage = (e: { origin: any; data: any }) => {
    if (e.origin === window.location.origin) {
      const { data } = e;
      console.log("postMesasge data", data);
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

  const openNewTab = (url: string) => {
    console.log("open auth tab url", url);

    window.removeEventListener("message", receiveMessage);
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=375, height=500, top=100, left=100";
    windowObjectReference = window.open(url, "_blank", strWindowFeatures);
    windowObjectReference?.focus();
    window.addEventListener("message", (event) => receiveMessage(event), false);
    windowObjectReference?.postMessage("hi", "*");
  };

  /*useEffect(() => {
    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].includes("{{")) {
          obj[key] = obj[key].replace(
            /\{\{(.+?)\}\}/g,
            (m: any, inputField: any) =>
              (inputField &&
                workflow?.trigger.credentials &&
                workflow?.trigger.credentials[inputField]) ||
              ""
          );
        }
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
      console.log("headers", headers);

      axios({
        method: triggerConnector.authentication.test.method,
        url: triggerConnector.authentication.test.url,
        headers: headers,
      })
        .then((res) => {
          if (res && res.data && res.data.email) {
            setEmail(res.data.email);
          }
        })
        .catch((err) => {
          clearCredentials();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);*/

  const handleTabClick = () => {
    setActiveStep?.(2);
  };

  if (!activeStep) {
    return null;
  }

  if (step < activeStep) {
    return (
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #DCDCDC",
          cursor: "pointer",
        }}
        onClick={handleTabClick}
      >
        <h2 style={{ textAlign: "left", margin: 0 }}>Set up trigger</h2>
      </div>
    );
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
      <h2 style={{ textAlign: "center", margin: 0 }}>
        Set up trigger for {triggerConnector.name}
      </h2>
      {isTriggerAuthenticationRequired && (
        <>
          {!triggerIsAuthenticated && (
            <button
              style={{
                display: "block",
                margin: "40px auto 0",
                padding: 10,
                textAlign: "center",
                width: "100%",
                maxWidth: 604,
              }}
              onClick={handleAuthClick}
            >
              Sign in to {triggerConnector.name}
            </button>
          )}
          {triggerIsAuthenticated && (
            <div
              style={{
                marginTop: 40,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              <label style={{ textAlign: "left", display: "block" }}>
                {triggerConnector.name} account
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  boxSizing: "border-box",
                }}
                type="text"
                value={email}
                readOnly
              />
              <button
                style={{
                  display: "block",
                  margin: "20px auto 0",
                  padding: 10,
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "100%",
                }}
                onClick={handleChangeAuth}
              >
                Change account
              </button>
            </div>
          )}
        </>
      )}

      {triggerIsAuthenticated && (
        <form onSubmit={handleFormSubmit}>
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
                        <label>
                          <span style={{ display: "block" }}>
                            {inputField.label}
                          </span>
                          {inputField.choices &&
                          inputField.choices.length > 0 ? (
                            <select
                              style={{
                                width: "100%",
                                padding: 10,
                              }}
                              value={
                                (formFields &&
                                  formFields[
                                    "trigger.input." + inputField.key
                                  ] &&
                                  formFields[
                                    "trigger.input." + inputField.key
                                  ].toString()) ||
                                ""
                              }
                              onChange={(e) => {
                                handleFieldChange(e, inputField);
                              }}
                              required={!!inputField.required}
                            >
                              <option value="">
                                {inputField.placeholder || ""}
                              </option>
                              {inputField.choices.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                  {choice.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              name={inputField.key}
                              style={{
                                width: "100%",
                                padding: 10,
                              }}
                              type="text"
                              placeholder={inputField.placeholder || ""}
                              required={!!inputField.required}
                              value={
                                (formFields &&
                                  formFields[
                                    "trigger.input." + inputField.key
                                  ] &&
                                  formFields[
                                    "trigger.input." + inputField.key
                                  ].toString()) ||
                                ""
                              }
                              onChange={(e) => {
                                handleFieldChange(e, inputField);
                              }}
                            />
                          )}
                        </label>
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
          <button
            style={{
              display: "block",
              margin: "40px auto 0",
              padding: 10,
              textAlign: "center",
              width: "100%",
              maxWidth: 604,
            }}
            type="submit"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );
};

export default TriggerConfiguration;
