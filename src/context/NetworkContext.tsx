//import NexusClient from "grindery-nexus-client";
import axios from "axios";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import useAppContext from "../hooks/useAppContext";
import useWorkspaceContext from "../hooks/useWorkspaceContext";
//import { useGrinderyNexus } from "use-grindery-nexus";

const CDS_EDITOR_API_ENDPOINT =
  "https://nexus-cds-editor-api.herokuapp.com/api";

type StateProps = {
  connectors: any[];
  connectorsLoading: boolean;
};

type ContextProps = {
  state: StateProps;
};

type NetworkContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    connectors: [],
    connectorsLoading: true,
  },
};

export const NetworkContext = createContext<ContextProps>(defaultContext);

export const NetworkContextProvider = ({ children }: NetworkContextProps) => {
  const { workspaceToken, isWorkspaceSwitching } = useWorkspaceContext();
  const { token } = useGrinderyNexus();

  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      connectors: [],
      connectorsLoading: true,
    }
  );

  const getConnectors = async (
    userToken: string | undefined,
    workspaceToken: string | null
  ) => {
    setState({ connectorsLoading: true });
    if (!userToken && !workspaceToken) {
      setState({ connectors: [], connectorsLoading: true });
    } else {
      let res;
      try {
        res = await axios.get(`${CDS_EDITOR_API_ENDPOINT}/cds`, {
          headers: {
            Authorization: `Bearer ${workspaceToken || userToken}`,
          },
        });
      } catch (err) {
        console.error("getConnectors error", err);
      }
      setState({
        connectors: res?.data?.result || [],
        connectorsLoading: false,
      });
    }
  };

  useEffect(() => {
    getConnectors(token?.access_token, workspaceToken);
  }, [token?.access_token, workspaceToken]);

  return (
    <NetworkContext.Provider value={{ state }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContextProvider;
