import React, { useState, createContext, useEffect } from "react";
import { defaultFunc, replaceTokens } from "../helpers/utils";
import useAppContext from "../hooks/useAppContext";

export type Workspace = {
  id: string;
  name: string;
  about: string;
  admin: string;
  admins: string[];
  members: string[];
};

type ContextProps = {
  workspace: null | Workspace;
  workspaces: Workspace[];
  createWorkspace: (data: any) => void;
  leaveWorkspace: (workspaceId: string) => void;
  setWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
};

type WorkspaceContextProps = {
  children: React.ReactNode;
};

const defaultWorkspace = {
  id: "{{user}}:personal",
  name: "My workspace",
  about: "Workspace description",
  admin: "{{user}}",
  admins: [],
  members: [],
};

const defaultContext = {
  workspace: defaultWorkspace,
  workspaces: [defaultWorkspace],
  createWorkspace: defaultFunc,
  leaveWorkspace: defaultFunc,
  setWorkspace: defaultFunc,
  setWorkspaces: defaultFunc,
};

export const WorkspaceContext = createContext<ContextProps>(defaultContext);

export const WorkspaceContextProvider = ({
  children,
}: WorkspaceContextProps) => {
  // App main context
  const { user, client } = useAppContext();

  // Currently active workspace.
  const [workspace, setWorkspace] = useState<null | Workspace>(null);

  // List of workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Get list of user's workspaces
  const listWorkspaces = async (userId: string) => {
    setWorkspaces([
      replaceTokens(defaultWorkspace, { user: userId }),
      {
        name: "Test workspace",
        id: "1",
        about: "Workspace description",
        admin: "123",
        admins: ["eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b"],
        members: [],
      },
      {
        name: "Grindery Core",
        id: "3",
        about: "Workspace description",
        admin: "123",
        admins: [],
        members: ["eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b"],
      },
    ]);
  };

  // Create new workspace
  const createWorkspace = async (data: any) => {};

  // Leave current workspace
  const leaveWorkspace = async (workspaceId: string) => {};

  // Get list of user's workspaces when user and client is known
  useEffect(() => {
    if (user && client) {
      listWorkspaces(user);
    }
  }, [user, client]);

  useEffect(() => {
    if (!workspace && workspaces && workspaces.length > 0) {
      setWorkspace(workspaces[0]);
    }
  }, [workspaces, workspace]);

  useEffect(() => {
    if (!user) {
      setWorkspace(null);
      setWorkspaces([]);
    }
  }, [user]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        workspaces,
        createWorkspace,
        leaveWorkspace,
        setWorkspace,
        setWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContextProvider;
