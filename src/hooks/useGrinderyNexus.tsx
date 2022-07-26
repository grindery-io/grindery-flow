import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import {
  getWorkflowExecutionLog,
  getWorkflowExecutions,
  listWorkflows,
  updateWorkflow,
} from "../helpers/engine";

async function createAuthProvider() {
  // The following assumes there is an injected `window.ethereum` provider
  const addresses = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return new EthereumAuthProvider(window.ethereum, addresses[0]);
}

type GrinderyNexusContextProps = {};

export const GrinderyNexusContext = createContext<GrinderyNexusContextProps>(
  {}
);

type GrinderyNexusContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({
  children,
}: GrinderyNexusContextProviderProps) => {
  // Auth hook
  const [connection, connect, disconnect] = useViewerConnection();

  // User id
  const [user, setUser] = useState<any>(null);

  const connectUser = () => {
    createAuthProvider().then(connect);
  };

  const addUser = useCallback((userId: string | null) => {
    setUser(userId);
  }, []);

  useEffect(() => {
    addUser(connection.status === "connected" ? connection.selfID.id : null);
  }, [connection, addUser]);

  return (
    <GrinderyNexusContext.Provider
      value={{
        connectUser,
        user,
        connection,
        connect,
        disconnect,
        listWorkflows,
        updateWorkflow,
        getWorkflowExecutionLog,
        getWorkflowExecutions,
      }}
    >
      {children}
    </GrinderyNexusContext.Provider>
  );
};

export const useGrinderyNexus = () => useContext(GrinderyNexusContext);

export default AppContextProvider;
