import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useViewerConnection } from "@self.id/react";
import { Workflow } from "../types/Workflow";
import { RIGHTBAR_TABS, WORKFLOW_ENGINE_URL } from "../constants";
import { Connector } from "../types/Connector";
import { defaultFunc, jsonrpcObj } from "../utils";

import gsheetConnector from "../samples/connectors/gsheet.json";
import moloch from "../samples/connectors/moloch.json";
import sendgrid from "../samples/connectors/sendgrid.json";

type ContextProps = {
  user: any;
  setUser?: (a: any) => void;
  activeTab: number;
  setActiveTab: (a: number) => void;
  changeTab: (a: string) => void;
  disconnect: any;
  workflowOpened: boolean;
  setWorkflowOpened: (a: boolean) => void;
  appOpened: boolean;
  setAppOpened: (a: boolean) => void;
  workflows: Workflow[];
  setWorkflows: (a: Workflow[]) => void;
  connectors: Connector[];
  getWorkflowsList: () => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<ContextProps>({
  user: "",
  setUser: defaultFunc,
  activeTab: 0,
  setActiveTab: defaultFunc,
  changeTab: defaultFunc,
  disconnect: defaultFunc,
  workflowOpened: false,
  setWorkflowOpened: defaultFunc,
  appOpened: true,
  setAppOpened: defaultFunc,
  workflows: [],
  setWorkflows: defaultFunc,
  connectors: [],
  getWorkflowsList: defaultFunc,
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  // Auth hook
  const [connection, disconnect] = useViewerConnection();

  // app panel opened
  const [appOpened, setAppOpened] = useState<boolean>(true);

  // User id
  const [user, setUser] = useState<any>(null);

  // user's workflows list
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // app tab
  const [activeTab, setActiveTab] = useState(0);

  // workflow builder opened
  const [workflowOpened, setWorkflowOpened] = useState(false);

  const connectors = [gsheetConnector, moloch, sendgrid];

  // change current active tab
  const changeTab = (name: string) => {
    setActiveTab(
      (RIGHTBAR_TABS.find((tab) => tab.name === name) || { id: 0 }).id
    );
  };

  const getWorkflowsList = () => {
    axios
      .post(
        WORKFLOW_ENGINE_URL,
        jsonrpcObj("or_listWorkflows", {
          userAccountId: user,
        })
      )
      .then((res) => {
        if (res && res.data && res.data.error) {
          console.log("or_listWorkflows error", res.data.error);
        }
        if (res && res.data && res.data.result) {
          setWorkflows(
            res.data.result
              .map((result: any) => ({
                ...result.workflow,
                state: "on",
                key: result.key,
              }))
              .filter((workflow: Workflow) => workflow)
          );
        }
      })
      .catch((err) => {
        console.log("or_listWorkflows error", err);
      });
  };

  const clearWorkflows = () => {
    setWorkflows([]);
  };

  useEffect(() => {
    if (user) {
      getWorkflowsList();
    } else {
      clearWorkflows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // set user id on success authentication
  useEffect(() => {
    if (connection.status === "connected") {
      setUser(connection.selfID.id);
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        changeTab,
        disconnect,
        setActiveTab,
        workflowOpened,
        setWorkflowOpened,
        appOpened,
        setAppOpened,
        workflows,
        setWorkflows,
        connectors,
        getWorkflowsList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
