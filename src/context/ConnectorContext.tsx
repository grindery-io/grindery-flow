//import NexusClient from "grindery-nexus-client";
import axios from "axios";
import React, { createContext, useReducer } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import useWorkspaceContext from "../hooks/useWorkspaceContext";

type StateProps = {
  id: string;
  cds: any;
  connector: any;
};

type ContextProps = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
};

type ConnectorContextProps = {
  children: React.ReactNode;
  connector: any;
};

const defaultContext = {
  state: {
    id: "",
    cds: null,
    connector: null,
  },
  setState: () => {},
};

export const ConnectorContext = createContext<ContextProps>(defaultContext);

export const ConnectorContextProvider = ({
  children,
  connector,
}: ConnectorContextProps) => {
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      id: connector?.id || "",
      cds: JSON.parse(connector?.values?.cds || {}),
      connector: connector || null,
    }
  );

  return (
    <ConnectorContext.Provider value={{ state, setState }}>
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorContextProvider;
