import React, { useState, createContext, useEffect, useCallback } from "react";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import _ from "lodash";
import {
  Workflow,
  WorkflowExecution,
  WorkflowExecutionLog,
} from "../types/Workflow";
import { RIGHTBAR_TABS, SCREEN } from "../constants";
import { Connector } from "../types/Connector";
import { defaultFunc, getSelfIdCookie } from "../helpers/utils";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import {
  getWorkflowExecutionLog,
  getWorkflowExecutions,
  isAllowedUser,
  listWorkflows,
  updateWorkflow,
} from "../helpers/engine";
import { getCDSFiles } from "../helpers/github";
//import helloWorldConnector from "../samples/connectors/helloworld.json";
import { validator } from "../helpers/validator";

async function createAuthProvider() {
  // The following assumes there is an injected `window.ethereum` provider
  const addresses = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return new EthereumAuthProvider(window.ethereum, addresses[0]);
}

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
  getWorkflowHistory: (
    a: string,
    b: (c: WorkflowExecutionLog[]) => void
  ) => void;
  getWorkflowExecution: (
    a: string,
    b: (c: WorkflowExecutionLog[]) => void
  ) => void;
  editWorkflow: (a: Workflow) => void;
  accessAllowed: boolean;
  validator: any;
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
  getWorkflowHistory: defaultFunc,
  getWorkflowExecution: defaultFunc,
  editWorkflow: defaultFunc,
  accessAllowed: false,
  validator: validator,
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  let navigate = useNavigate();
  const { width } = useWindowSize();

  // Auth hook
  const [connection, connect, disconnect] = useViewerConnection();

  // app panel opened
  const [appOpened, setAppOpened] = useState<boolean>(
    width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
      width < parseInt(SCREEN.DESKTOP.replace("px", ""))
      ? false
      : true
  );

  // User id
  const [user, setUser] = useState<any>(null);
  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);

  // user's workflows list
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // connectors list
  const [connectors, setConnectors] = useState<Connector[]>([]);

  // change current active tab
  const changeTab = (name: string) => {
    const tab = RIGHTBAR_TABS.find((tab) => tab.name === name);
    navigate((tab && tab.path) || "/");
  };

  const getWorkflowsList = async () => {
    const res = await listWorkflows(user);

    if (res && res.data && res.data.error) {
      console.log("or_listWorkflows error", res.data.error);
    }
    if (res && res.data && res.data.result) {
      setWorkflows(
        res.data.result
          .map((result: any) => ({
            ...result.workflow,
            key: result.key,
          }))
          .filter((workflow: Workflow) => workflow)
      );
    }
  };

  const clearWorkflows = () => {
    setWorkflows([]);
  };

  const getConnectors = async () => {
    const responses = await getCDSFiles();

    setConnectors(
      _.orderBy(
        [...responses.filter((res) => res && res.data).map((res) => res.data)],
        [(response) => response.name.toLowerCase()],
        ["asc"]
      )
    );
  };

  const getWorkflowHistory = useCallback(
    async (
      workflowKey: string,
      callback: (newItems: WorkflowExecutionLog[]) => void
    ) => {
      const res = await getWorkflowExecutions(workflowKey);

      if (res && res.data && res.data.error) {
        console.error("or_getWorkflowExecutions error", res.data.error);
      }
      if (res && res.data && res.data.result) {
        const executions = res.data.result;
        executions.forEach((execution: WorkflowExecution) => {
          getWorkflowExecution(execution.executionId, callback);
        });
      }
    },
    []
  );

  const getWorkflowExecution = useCallback(
    async (
      executionId: string,
      callback: (newItems: WorkflowExecutionLog[]) => void
    ) => {
      const res = await getWorkflowExecutionLog(executionId);

      if (res && res.data && res.data.error) {
        console.error("or_getWorkflowExecutionLog error", res.data.error);
      }
      if (res && res.data && res.data.result) {
        callback(res.data.result);
      }
    },
    []
  );

  const editWorkflow = async (workflow: Workflow) => {
    const res = await updateWorkflow(workflow, user);

    if (res && res.data && res.data.error) {
      console.error("editWorkflow error", res.data.error);
    }
    if (res && res.data && res.data.result) {
      getWorkflowsList();
    }
  };

  const verifyUser = async (userId: string) => {
    const res = await isAllowedUser(userId);
    if (res && res.data && res.data.error) {
      console.error("or_isAllowedUser error", res.data.error);
      setUser(userId);
      setAccessAllowed(false);
    }
    if (res && res.data && res.data.result) {
      setUser(userId);
      setAccessAllowed(true);
    } else {
      setUser(userId);
      setAccessAllowed(false);
    }
  };

  useEffect(() => {
    if (user) {
      getConnectors();
      getWorkflowsList();
    } else {
      clearWorkflows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // set user id on success authentication
  useEffect(() => {
    if (connection.status === "connected") {
      if (!user) {
        //setUser(connection.selfID.id);
        verifyUser(connection.selfID.id);
        if (!workflows || workflows.length < 1) {
          navigate("/workflows/create");
        } else {
          navigate("/dashboard");
        }
      } else {
        setUser(connection.selfID.id);
      }
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, workflows]);

  useEffect(() => {
    const cookie = getSelfIdCookie();
    if (
      cookie &&
      "ethereum" in window &&
      connection.status !== "connecting" &&
      connection.status !== "connected"
    ) {
      createAuthProvider().then(connect);
    }
  }, [connection, connect]);

  useEffect(() => {
    if (
      width >= parseInt(SCREEN.TABLET_XL.replace("px", "")) &&
      width < parseInt(SCREEN.DESKTOP.replace("px", "")) &&
      appOpened
    ) {
      setAppOpened(false);
    }
    if (width < parseInt(SCREEN.TABLET.replace("px", "")) && !appOpened) {
      setAppOpened(true);
    }
  }, [width, appOpened]);

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
        getWorkflowHistory,
        getWorkflowExecution,
        editWorkflow,
        accessAllowed,
        validator,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
