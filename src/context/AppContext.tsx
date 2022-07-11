import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import _ from "lodash";
import { Workflow } from "../types/Workflow";
import {
  RIGHTBAR_TABS,
  WORKFLOW_ENGINE_URL,
  WEB2_CONNECTORS_PATH,
  WEB3_CONNECTORS_PATH,
  SCREEN,
} from "../constants";
import { Connector } from "../types/Connector";
import { defaultFunc, getSelfIdCookie, jsonrpcObj } from "../utils";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

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
  getWorkflowExecutions: (a: string) => void;
  editWorkflow: (a: Workflow) => void;
  accessAllowed: boolean;
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
  getWorkflowExecutions: defaultFunc,
  editWorkflow: defaultFunc,
  accessAllowed: false,
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

  const getConnectors = async () => {
    const responses = [];
    const web2Connectors = await axios.get(WEB2_CONNECTORS_PATH);
    for (let i = 0; i < web2Connectors.data.length; i++) {
      const url = web2Connectors.data[i].download_url;
      if (url) {
        responses.push(
          await axios.get(
            `${url}${/\?/.test(url) ? "&" : "?"}v=${encodeURIComponent(
              "2022.07.05v1"
            )}`
          )
        );
      }
    }
    const web3Connectors = await axios.get(WEB3_CONNECTORS_PATH);
    for (let i = 0; i < web3Connectors.data.length; i++) {
      const url = web3Connectors.data[i].download_url;
      if (url) {
        responses.push(
          await axios.get(
            `${url}${/\?/.test(url) ? "&" : "?"}v=${encodeURIComponent(
              "2022.07.05v1"
            )}`
          )
        );
      }
    }

    setConnectors(
      _.orderBy(
        responses.filter((res) => res && res.data).map((res) => res.data),
        [(response) => response.name.toLowerCase()],
        ["asc"]
      )
    );
  };

  const getWorkflowExecutions = (workflowKey: string) => {
    axios
      .post(
        WORKFLOW_ENGINE_URL,
        jsonrpcObj("or_getWorkflowExecutions", {
          workflowKey: workflowKey,
        })
      )
      .then((res) => {
        if (res && res.data && res.data.error) {
          console.error("or_getWorkflowExecutions error", res.data.error);
        }
        if (res && res.data && res.data.result) {
          console.log("or_getWorkflowExecutions result", res.data.result);
        }
      })
      .catch((err) => {
        console.error("or_getWorkflowExecutions error", err);
      });
  };

  const editWorkflow = (workflow: Workflow) => {
    axios
      .post(
        WORKFLOW_ENGINE_URL,
        jsonrpcObj("or_updateWorkflow", {
          key: workflow.key,
          userAccountId: user,
          workflow: workflow,
        })
      )
      .then((res) => {
        if (res && res.data && res.data.error) {
          console.error("or_updateWorkflow error", res.data.error);
        }
        if (res && res.data && res.data.result) {
          getWorkflowsList();
        }
      })
      .catch((err) => {
        console.error("or_updateWorkflow error", err);
      });
  };

  const checkUser = (userId: string) => {
    axios
      .post(
        WORKFLOW_ENGINE_URL,
        jsonrpcObj("or_isAllowedUser", {
          userAccountId: userId,
        })
      )
      .then((res) => {
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
      })
      .catch((err) => {
        console.error("or_isAllowedUser error", err);
        setUser(userId);
        setAccessAllowed(false);
      });
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
        checkUser(connection.selfID.id);
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
        getWorkflowExecutions,
        editWorkflow,
        accessAllowed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
