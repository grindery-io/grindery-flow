import React, { createContext, useEffect, useReducer, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router";

type StateProps = {
  id: string;
  cds: any;
  connector: any;
  isSaving: boolean;
  confirm: {
    message: string;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
  snackbar: {
    opened: boolean;
    message: string;
    severity: string;
    onClose: () => void;
  };
};

type ContextProps = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
  saveConnector: () => void;
  onConnectorSettingsSave: (data: any) => void;
  onOperationSettingsSave: (type: any, operation: any) => void;
  onOperationDelete: (type: any, operationKey: string) => void;
  onInputFieldSave: (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => void;
  onInputFieldDelete: (key: string, type: any, inputKey: string) => void;
};

type ConnectorContextProps = {
  children: React.ReactNode;
  connector: any;
};

const defaultContext = {
  state: {
    id: "",
    cds: null,
    connector: null,
    isSaving: false,
    confirm: {
      message: "",
      opened: false,
      onClose: () => {},
      onConfirm: () => {},
    },
    snackbar: {
      opened: false,
      message: "",
      severity: "",
      onClose: () => {},
    },
  },
  setState: () => {},
  saveConnector: () => {},
  onConnectorSettingsSave: () => {},
  onOperationSettingsSave: () => {},
  onOperationDelete: () => {},
  onInputFieldSave: () => {},
  onInputFieldDelete: () => {},
};

export const ConnectorContext = createContext<ContextProps>(defaultContext);

export const ConnectorContextProvider = ({
  children,
  connector,
}: ConnectorContextProps) => {
  let navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      id: connector?.id || "",
      cds: JSON.parse(connector?.values?.cds || {}),
      connector: connector || null,
      isSaving: false,
      confirm: {
        message: "",
        opened: false,
        onClose: () => {},
        onConfirm: () => {},
      },
      snackbar: {
        opened: false,
        message: "",
        severity: "",
        onClose: () => {},
      },
    }
  );

  const saveConnector = async () => {
    // TODO: save connector to the HubDB
    setState({
      isSaving: true,
    });
    setTimeout(() => {
      setState({
        isSaving: false,
      });
    }, 1000);
  };

  const onConnectorSettingsSave = (data: any) => {
    if (data) {
      setState({
        cds: {
          ...state.cds,
          name: data.name,
          icon: data.icon,
          description: data.description,
        },
        snackbar: {
          opened: true,
          message: `Connector saved`,
          severity: "success",
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "success",
                onClose: () => {},
              },
            });
          },
        },
      });
      navigate(`/network/connector/${state.id}`);
    }
  };

  const onOperationSettingsSave = (type: any, operation: any) => {
    if (type) {
      if (operation) {
        const isNewoperation = !state.cds[type].find(
          (op: any) => op.key === operation.key
        );
        const operations = isNewoperation
          ? [...state.cds[type], operation]
          : [
              ...state.cds[type].map((op: any) => {
                if (op.key === operation.key) {
                  return operation;
                } else {
                  return op;
                }
              }),
            ];
        setState({
          cds: { ...state.cds, [type]: [...operations] },
          snackbar: {
            opened: true,
            message: `${type === "triggers" ? "Trigger" : "Action"} saved`,
            severity: "success",
            onClose: () => {
              setState({
                snackbar: {
                  opened: false,
                  message: "",
                  severity: "success",
                  onClose: () => {},
                },
              });
            },
          },
        });
        navigate(
          `/network/connector/${state.id}/${type}/${operation.key}/${
            isNewoperation ? "inputFields" : "settings"
          }`
        );
      }
    }
  };

  const onOperationDelete = (type: any, operationKey: string) => {
    setState({
      confirm: {
        message: `Are you sure you want to delete this ${
          type === "triggers" ? "trigger" : "action"
        }?`,
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            const newCDS = _.cloneDeep(state.cds);
            const index = newCDS?.[type].findIndex(
              (op: { key: string }) => op.key === operationKey
            );
            newCDS?.[type].splice(index, 1);
            setState({
              cds: newCDS,
            });
          }
        },
      },
    });
  };

  const onInputFieldSave = (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => {
    navigate(`/network/connector/${state.id}/${type}/${key}/inputFields`);
    if (type) {
      setState({
        cds: {
          ...state.cds,
          [type]: [
            ...state.cds[type].map((op: any) => {
              if (op.key === key) {
                return {
                  ...op,
                  operation: {
                    ...op.operation,
                    inputFields: [
                      ...op.operation.inputFields.map((field: any) => {
                        if (field.key === inputKey) {
                          return {
                            ...field,
                            ...inputData,
                          };
                        } else {
                          return field;
                        }
                      }),
                      ...(inputKey === "__new__" ? [{ ...inputData }] : []),
                    ],
                  },
                };
              } else {
                return op;
              }
            }),
          ],
        },
      });
    }
  };

  const onInputFieldDelete = (key: string, type: any, inputKey: string) => {
    setState({
      confirm: {
        message: "Are you sure you want to delete the input field?",
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            setState({
              cds: {
                ...state.cds,
                [type]: [
                  ...state.cds[type].map((op: any) => {
                    if (op.key === key) {
                      return {
                        ...op,
                        operation: {
                          ...op.operation,
                          inputFields: [
                            ...op.operation.inputFields.filter(
                              (field: any) => field.key !== inputKey
                            ),
                          ],
                        },
                      };
                    } else {
                      return op;
                    }
                  }),
                ],
              },
            });
          }
        },
      },
    });
  };

  useEffect(() => {
    console.log(`Save connector fired`);
    setCount((count) => count + 1);
  }, [state.cds]);

  console.log(`Save connector fired ${count} times`);

  console.log("connector cds", state.cds);

  return (
    <ConnectorContext.Provider
      value={{
        state,
        setState,
        saveConnector,
        onConnectorSettingsSave,
        onOperationSettingsSave,
        onOperationDelete,
        onInputFieldSave,
        onInputFieldDelete,
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorContextProvider;
