//import NexusClient from "grindery-nexus-client";
import axios from "axios";
import React, { createContext, useEffect, useReducer, useState } from "react";
import useAppContext from "../hooks/useAppContext";
import useWorkspaceContext from "../hooks/useWorkspaceContext";
//import { useGrinderyNexus } from "use-grindery-nexus";

type StateProps = {
  cdss: any[];
  cdssLoading: boolean;
};

type ContextProps = {
  state: StateProps;
};

type NetworkContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    cdss: [],
    cdssLoading: true,
  },
};

export const NetworkContext = createContext<ContextProps>(defaultContext);

export const NetworkContextProvider = ({ children }: NetworkContextProps) => {
  const { workspace } = useWorkspaceContext();
  const { user } = useAppContext();

  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      cdss: [],
      cdssLoading: true,
    }
  );

  const getConnectors = async (
    userId: string | null,
    workspace: string | null
  ) => {
    setState({ cdssLoading: true });
    if (!userId && !workspace) {
      setState({ cdss: [], cdssLoading: true });
    } else {
      let res;
      const query =
        workspace && workspace !== "personal"
          ? `&workspace=${workspace}`
          : userId
          ? `&user=${userId}`
          : "";
      try {
        res = await axios.get(
          `https://api.hubapi.com/hubdb/api/v2/tables/5526902/rows?portalId=22257229${query}`
        );
      } catch (err) {
        console.error("getConnectors error", err);
      }
      setState({ cdss: res?.data?.objects || [], cdssLoading: false });
    }
  };

  useEffect(() => {
    getConnectors(user, workspace);
  }, [user, workspace]);

  return (
    <NetworkContext.Provider value={{ state }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContextProvider;
