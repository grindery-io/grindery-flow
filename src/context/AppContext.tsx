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
import { useNavigate } from "react-router-dom";

type ContextProps = {
  user: any;
  setUser?: (a: any) => void;
  changeTab: (a: string) => void;
  disconnect: any;
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
  changeTab: defaultFunc,
  disconnect: defaultFunc,
  appOpened: true,
  setAppOpened: defaultFunc,
  workflows: [],
  setWorkflows: defaultFunc,
  connectors: [],
  getWorkflowsList: defaultFunc,
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  let navigate = useNavigate();

  // Auth hook
  const [connection, disconnect] = useViewerConnection();

  // app panel opened
  const [appOpened, setAppOpened] = useState<boolean>(true);

  // User id
  const [user, setUser] = useState<any>(null);

  // user's workflows list
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const connectors = [gsheetConnector, moloch, sendgrid];

  // change current active tab
  const changeTab = (name: string) => {
    const tab = RIGHTBAR_TABS.find((tab) => tab.name === name);
    navigate((tab && tab.path) || "/");
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
      if (!workflows || workflows.length < 1) {
        navigate("/workflows");
      }
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, workflows]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        changeTab,
        disconnect,
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
