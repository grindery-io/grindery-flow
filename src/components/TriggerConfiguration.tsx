import React from "react";
import { useAppContext } from "../context/AppContext";

type Props = {};

const TriggerConfiguration = (props: Props) => {
  const { workflow, setWorkflow, trigger, setTriggerConfigSubmitted } =
    useAppContext();

  if (!workflow || !setWorkflow) {
    return null;
  }

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    inputField: {
      label: any;
      key: any;
      placeholder: any;
      type: any;
    }
  ) => {
    if (setTriggerConfigSubmitted) {
      setTriggerConfigSubmitted(false);
    }
    setWorkflow({
      ...workflow,
      trigger: {
        ...workflow?.trigger,
        input: {
          ...workflow?.trigger.input,
          [inputField.key]: e.target.value,
        },
      },
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (setTriggerConfigSubmitted) {
      setTriggerConfigSubmitted(true);
    }
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
      <h2 style={{ textAlign: "center", margin: 0 }}>Set up trigger</h2>
      <form onSubmit={handleFormSubmit}>
        {trigger &&
          trigger.operation &&
          trigger.operation.inputFields &&
          trigger.operation.inputFields.map(
            (inputField: {
              label: any;
              key: any;
              placeholder: any;
              type: any;
              required: any;
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
                      <input
                        name={inputField.key}
                        style={{
                          width: "100%",
                          padding: 10,
                        }}
                        type="text"
                        placeholder={inputField.placeholder || ""}
                        required={!!inputField.required}
                        value={workflow?.trigger.input[inputField.key] || ""}
                        onChange={(e) => {
                          handleFieldChange(e, inputField);
                        }}
                      />
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
    </div>
  );
};

export default TriggerConfiguration;
