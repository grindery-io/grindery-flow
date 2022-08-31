import React, { useState, createContext, useEffect } from "react";
import { defaultFunc } from "../helpers/utils";
import useAppContext from "../hooks/useAppContext";

type ContextProps = {
  workspace: string;
  workspaces: any[];
  createWorkspace: (data: any) => void;
  leaveWorkspace: (workspaceId: string) => void;
};

type WorkspaceContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  workspace: "personal",
  workspaces: [],
  createWorkspace: defaultFunc,
  leaveWorkspace: defaultFunc,
};

export const WorkspaceContext = createContext<ContextProps>(defaultContext);

export const WorkspaceContextProvider = ({
  children,
}: WorkspaceContextProps) => {
  // App main context
  const { user, client } = useAppContext();

  // Currently active workspace. Personal by default.
  const [workspace, setWorkspace] = useState("personal");

  // List of workspaces
  const [workspaces, setWorkspaces] = useState([]);

  // Get list of user's workspaces
  const listWorkspaces = async () => {
    setWorkspaces([]);
  };

  // Create new workspace
  const createWorkspace = async (data: any) => {};

  // Leave current workspace
  const leaveWorkspace = async (workspaceId: string) => {};

  // Get list of user's workspaces when user and client is known
  useEffect(() => {
    if (user && client) {
      listWorkspaces();
    }
  }, [user, client]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        workspaces,
        createWorkspace,
        leaveWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContextProvider;
