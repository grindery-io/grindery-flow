import React, { useState, createContext, useEffect, useCallback } from "react";
import _ from "lodash";
import { useGrinderyNexus } from "use-grindery-nexus";
import NexusClient, {
  Workflow,
  WorkflowExecution,
  WorkflowExecutionLog,
} from "grindery-nexus-client";
/*import {
  Workflow,
  WorkflowExecution,
  WorkflowExecutionLog,
} from "../types/Workflow";*/
import { isLocalOrStaging, RIGHTBAR_TABS, SCREEN } from "../constants";
import { Connector } from "../types/Connector";
import { defaultFunc, getStagingConnectors } from "../helpers/utils";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
//import helloWorldConnector from "../samples/connectors/helloworld.json";
import { validator } from "../helpers/validator";
import { Operation } from "../types/Workflow";
import useWorkspaceContext from "../hooks/useWorkspaceContext";

type ContextProps = {
  user: any;
  changeTab: (a: string, b?: string) => void;
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
  verifying: boolean;
  workflowExecutions: WorkflowExecutionLog[][];
  setWorkflowExecutions: React.Dispatch<
    React.SetStateAction<WorkflowExecutionLog[][]>
  >;
  apps: any[];
  handleDevModeChange: (a: boolean) => void;
  devMode: boolean;
  deleteWorkflow: (userAccountId: string, key: string) => void;
  client: NexusClient | null;
  access_token: string | undefined;
  moveWorkflowToWorkspace: (
    workflowKey: string,
    workspaceKey: string,
    client: NexusClient | null
  ) => void;
  getConnector: (key: string) => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<ContextProps>({
  user: "",
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
  verifying: true,
  workflowExecutions: [],
  setWorkflowExecutions: defaultFunc,
  apps: [],
  handleDevModeChange: defaultFunc,
  devMode: false,
  deleteWorkflow: defaultFunc,
  client: null,
  access_token: undefined,
  moveWorkflowToWorkspace: defaultFunc,
  getConnector: defaultFunc,
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  let navigate = useNavigate();
  const { width } = useWindowSize();

  // current workspace
  const { workspace } = useWorkspaceContext();

  // Dev mode state
  const cachedDevMode = localStorage.getItem("gr_dev_mode");
  const [devMode, setDevMode] = useState(cachedDevMode === "true");

  // Auth hook
  const { user, disconnect, token } = useGrinderyNexus();

  const access_token = token?.access_token;

  // app panel opened
  const [appOpened, setAppOpened] = useState<boolean>(
    width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
      width < parseInt(SCREEN.DESKTOP.replace("px", ""))
      ? false
      : true
  );

  // User id
  //const [user, setUser] = useState<any>(null);
  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);

  // user's workflows list
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // connectors list
  const [connectors, setConnectors] = useState<Connector[]>([]);

  // verification state
  const [verifying, setVerifying] = useState<boolean>(true);

  // workflows executions
  const [workflowExecutions, setWorkflowExecutions] = useState<
    WorkflowExecutionLog[][]
  >([]);

  // list of apps used in workflows
  const [apps, setApps] = useState<any[]>([]);

  // Nexus API client
  const [client, setClient] = useState<NexusClient | null>(null);

  // change current active tab
  const changeTab = (name: string, query = "") => {
    const tab = RIGHTBAR_TABS.find((tab) => tab.name === name);
    navigate(((tab && tab.path) || "/") + (query ? "?" + query : ""));
  };

  const getWorkflowsList = async () => {
    const res = await client
      ?.listWorkflows(
        workspace && workspace !== "personal" ? workspace : undefined
      )
      .catch((err) => {
        console.error("listWorkflows error:", err.message);
      });

    if (res) {
      setWorkflows(
        res
          .map((result: any) => ({
            ...result.workflow,
            key: result.key,
          }))
          .filter((workflow: Workflow) => workflow)
      );
    } else {
      setWorkflows([]);
    }
  };

  const clearWorkflows = () => {
    setWorkflows([]);
  };

  const getConnectors = async () => {
    let stagedCdss = [];
    const cdss = await client?.listDrivers();
    if (isLocalOrStaging) {
      stagedCdss = await client?.listDrivers("staging");
    }

    setConnectors(
      _.orderBy(
        stagedCdss.length > 0 ? stagedCdss : cdss,
        [(cds) => cds.name.toLowerCase()],
        ["asc"]
      )
    );
  };

  const getConnector = async (key: string) => {
    const connector = await client?.getDriver(
      key,
      isLocalOrStaging ? "staging" : undefined
    );
    if (connector) {
      setConnectors(
        _.orderBy(
          [...connectors.map((c) => (c.key === key ? connector : c))],
          [(cds) => cds.name.toLowerCase()],
          ["asc"]
        )
      );
    }
  };

  const getWorkflowExecution = useCallback(
    async (
      executionId: string,
      callback: (newItems: WorkflowExecutionLog[]) => void
    ) => {
      const res = await client
        ?.getWorkflowExecutionLog(executionId)
        .catch((err) => {
          console.error("getWorkflowExecutionLog error:", err.message);
        });

      if (res) {
        callback(res);
      }
    },
    [client]
  );

  const getWorkflowHistory = useCallback(
    async (
      workflowKey: string,
      callback: (newItems: WorkflowExecutionLog[]) => void
    ) => {
      //const res = await getWorkflowExecutions(workflowKey);
      const executions = await client
        ?.getWorkflowExecutions(workflowKey)
        .catch((err) => {
          console.error("getWorkflowExecutions error:", err.message);
        });

      if (executions) {
        executions.forEach((execution: WorkflowExecution) => {
          getWorkflowExecution(execution.executionId, callback);
        });
      }
    },
    [getWorkflowExecution, client]
  );

  const editWorkflow = async (workflow: Workflow) => {
    const res = await client
      ?.updateWorkflow(workflow.key, workflow)
      .catch((err) => {
        console.error("updateWorkflow error:", err.message);
      });

    if (res) {
      getWorkflowsList();
    }
  };

  const verifyUser = async () => {
    setVerifying(true);
    const res = await client?.isAllowedUser().catch((err) => {
      console.error("isAllowedUser error:", err.message);
      setAccessAllowed(false);
    });
    if (res) {
      setAccessAllowed(true);
    } else {
      setAccessAllowed(false);
    }
    setVerifying(false);
  };

  const addExecutions = useCallback((newItems: WorkflowExecutionLog[]) => {
    setWorkflowExecutions((items) => [...items, newItems]);
  }, []);

  const getApps = (workflowsList: Workflow[], connectorsList: Connector[]) => {
    if (workflowsList && workflowsList.length > 0) {
      const usedConnectorsKeys = _.uniq(
        _.flatten(
          workflowsList.map((workflow: Workflow) => [
            workflow.trigger.connector,
            ...workflow.actions.map((action: Operation) => action.connector),
          ])
        )
      );
      const usedApps = _.orderBy(
        usedConnectorsKeys.map((connectorKey: string) => {
          const connectorObject = connectorsList.find(
            (connector: Connector) => connector.key === connectorKey
          );
          return {
            name: (connectorObject && connectorObject.name) || "",
            icon: (connectorObject && connectorObject.icon) || "",
            workflows: workflowsList.filter(
              (workflow: Workflow) =>
                workflow.trigger.connector === connectorKey ||
                workflow.actions.filter(
                  (action: Operation) => action.connector === connectorKey
                ).length > 0
            ).length,
          };
        }),
        ["workflows", "name"],
        ["desc"]
      );
      setApps(usedApps);
    } else {
      setApps([]);
    }
  };

  const handleDevModeChange = (e: boolean) => {
    localStorage.setItem("gr_dev_mode", e.toString());
    setDevMode(e);
  };

  const deleteWorkflow = async (userAccountId: string, key: string) => {
    const res = await client?.deleteWorkflow(key).catch((err) => {
      console.error("deleteWorkflow error:", err.message);
    });
    if (res) {
      getWorkflowsList();
    }
  };

  const initClient = (accessToken: string) => {
    const nexus = new NexusClient();
    nexus.authenticate(accessToken);
    setClient(nexus);
  };

  const moveWorkflowToWorkspace = async (
    workflowKey: string,
    workspaceKey: string,
    client: NexusClient | null
  ) => {
    const res = await client?.moveWorkflowToWorkspace(
      workflowKey,
      workspaceKey
    );
    if (res) {
      getWorkflowsList();
    }
  };

  useEffect(() => {
    setWorkflowExecutions([]);
    if (workflows && workflows.length > 0) {
      workflows.forEach((workflow) => {
        if (workflow.key) {
          getWorkflowHistory(workflow.key, addExecutions);
        }
      });
    }
  }, [workflows, addExecutions, getWorkflowHistory]);

  useEffect(() => {
    if (user && accessAllowed && client && workspace) {
      getConnectors();
      getWorkflowsList();
    } else {
      clearWorkflows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessAllowed, client, workspace]);

  useEffect(() => {
    if (user && client) {
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, client]);

  // verify user on success authentication
  useEffect(() => {
    if (user && token?.access_token) {
      initClient(token?.access_token);
      navigate("/workflows");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token?.access_token]);

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

  useEffect(() => {
    getApps(workflows, connectors);
  }, [workflows, connectors]);

  return (
    <AppContext.Provider
      value={{
        user,
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
        verifying,
        workflowExecutions,
        setWorkflowExecutions,
        apps,
        devMode,
        handleDevModeChange,
        deleteWorkflow,
        client,
        access_token,
        moveWorkflowToWorkspace,
        getConnector,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
