import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

type Props = {};

const TriggerConfiguration = (props: Props) => {
  const {
    workflow,
    updateWorkflow,
    trigger,
    triggerAuthenticationFields,
    isTriggerAuthenticationRequired,
    triggerIsAuthenticated,
    triggerConnector,
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

  useEffect(() => {
    const urlArray = window.location.href.split("#");
    if (urlArray[1]) {
      const hash = urlArray[1].split("&");
      const params = Object.fromEntries(
        hash.map((h) => {
          const param = h.split("=");
          const key = param[0];
          const val = param[1];
          return [key, val];
        })
      );
      setAuthCredentials(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!workflow || !updateWorkflow) {
    return null;
  }

  const setAuthCredentials = (params: any) => {
    if (triggerAuthenticationFields && triggerAuthenticationFields.length > 0) {
      const credentials = Object.fromEntries(
        triggerAuthenticationFields.map((field) => [field, params[field] || ""])
      );
      console.log("credentials", credentials);
      updateWorkflow({
        "trigger.credentials": credentials,
      });
      if (credentials && credentials.access_token) {
        axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: "Bearer " + credentials.access_token,
            },
          })
          .then((res) => {
            if (res && res.data && res.data.email) {
              setEmail(res.data.email);
            }
          });
      }
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
        window.location.href =
          triggerConnector.authentication.oauth2Config.authorizeUrl.url +
          "&redirect_uri=http://localhost:3000";
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
    updateWorkflow(formFields);
  };

  const handleChangeAuth = () => {
    updateWorkflow({
      "trigger.credentials": undefined,
    });
    handleAuthClick();
  };

  return (
    <div
      style={{
        maxWidth: 816,
        margin: "54px auto 0",
        padding: "80px 100px",
        border: "1px solid #DCDCDC",
        borderRadius: 10,
      }}
    >
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
                width: "100%",
                maxWidth: 604,
                margin: "40px auto 0",
                textAlign: "center",
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
                          marginTop: 40,
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
