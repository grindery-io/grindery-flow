import React, { useState, createContext, useContext, useEffect } from "react";
import { useViewerConnection } from "@self.id/react";
import { Workflow } from "../types/Workflow";
import { RIGHTBAR_TABS } from "../constants";

import gsheetConnector from "../samples/connectors/gsheet.json";
import moloch from "../samples/connectors/moloch.json";
import helloworldConnector from "../samples/connectors/helloworld.json";
import sendgrid from "../samples/connectors/sendgrid.json";
import { Connector } from "../types/Connector";

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
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

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

  const connectors = [helloworldConnector, gsheetConnector, moloch, sendgrid];

  // change current active tab
  const changeTab = (name: string) => {
    setActiveTab(
      (RIGHTBAR_TABS.find((tab) => tab.name === name) || { id: 0 }).id
    );
  };

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
