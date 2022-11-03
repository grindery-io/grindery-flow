//import NexusClient from "grindery-nexus-client";
import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import { isLocalOrStaging } from "../constants";
import useWorkspaceContext from "../hooks/useWorkspaceContext";

const CDS_EDITOR_API_ENDPOINT =
  "https://nexus-cds-editor-api.herokuapp.com/api";

type StateProps = {
  connectors: any[];
  connectorsLoading: boolean;
  blockchains: any[];
};

type ContextProps = {
  state: StateProps;
  refreshConnectors: () => Promise<{ success: boolean }>;
};

type NetworkContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    connectors: [],
    connectorsLoading: true,
    blockchains: [],
  },
  refreshConnectors: async () => {
    return { success: false };
  },
};

export const NetworkContext = createContext<ContextProps>(defaultContext);

export const NetworkContextProvider = ({ children }: NetworkContextProps) => {
  const { workspaceToken } = useWorkspaceContext();
  const { token } = useGrinderyNexus();

  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      connectors: [],
      connectorsLoading: true,
      blockchains: [],
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
        res = await axios.get(
          `${CDS_EDITOR_API_ENDPOINT}/cds?environment=${
            isLocalOrStaging ? "staging" : "production"
          }`,
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || userToken}`,
            },
          }
        );
      } catch (err) {
        console.error("getConnectors error", err);
      }
      setState({
        connectors: res?.data?.result || [],
        connectorsLoading: false,
      });
    }
  };

  const refreshConnectors = async () => {
    if (!token?.access_token && !workspaceToken) {
      return { success: false };
    } else {
      let res;
      try {
        res = await axios.get(
          `${CDS_EDITOR_API_ENDPOINT}/cds?environment=${
            isLocalOrStaging ? "staging" : "production"
          }`,
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || token?.access_token}`,
            },
          }
        );
      } catch (err) {
        console.error("getConnectors error", err);
        return { success: false };
      }
      setState({
        connectors: res?.data?.result || [],
      });
      return { success: true };
    }
  };

  const getChains = async (userToken: string | undefined) => {
    if (!userToken) {
      setState({ blockchains: [] });
    } else {
      let res;
      try {
        res = await axios.get(`${CDS_EDITOR_API_ENDPOINT}/blockchains`, {
          headers: {
            Authorization: `Bearer ${workspaceToken || userToken}`,
          },
        });
      } catch (err) {
        console.error("getConnectors error", err);
      }
      setState({
        blockchains: res?.data?.result || [],
      });
    }
  };

  useEffect(() => {
    getConnectors(token?.access_token, workspaceToken);
  }, [token?.access_token, workspaceToken]);

  useEffect(() => {
    getChains(token?.access_token);
  }, [token?.access_token]);

  return (
    <NetworkContext.Provider value={{ state, refreshConnectors }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContextProvider;
