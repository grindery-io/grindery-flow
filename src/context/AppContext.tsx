import React, { useState, createContext, useContext } from "react";
import gsheetConnector from "../samples/gsheet-connector.json";
import molochXdaiConnector from "../samples/moloch-xdai-connector.json";
import { Workflow } from "../types/Workflow";

type ContextProps = {
  state: any;
  setState?: (a: any) => void;
  connectors?: any[];
  workflow?: Workflow;
  setWorkflow: (a: any) => void;
  connectorsWithTriggers: any[];
  connectorsWithActions: any[];
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [state, setState] = useState({});
  const connectors = [gsheetConnector, molochXdaiConnector];
  const [workflow, setWorkflow] = useState({
    title: "New workflow",
    trigger: {
      type: "trigger",
      connector: "",
      operation: "",
      input: {},
      display: {},
      authentication: {},
    },
    actions: [
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
        display: {},
        authentication: {},
      },
    ],
    creator: "demo:user",
    signature: "",
  });

  const connectorsWithTriggers = connectors?.filter(
    (connector) =>
      connector && connector.triggers && connector.triggers.length > 0
  );
  const connectorsWithActions = connectors?.filter(
    (connector) =>
      connector && connector.actions && connector.actions.length > 0
  );

  console.log("workflow", workflow);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        connectors,
        workflow,
        setWorkflow,
        connectorsWithActions,
        connectorsWithTriggers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
