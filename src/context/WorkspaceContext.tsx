import React, { useState, createContext, useEffect } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import { defaultFunc, replaceTokens } from "../helpers/utils";
import { workspacesRequest } from "../helpers/workspaces";

export type Workspace = {
  key: string;
  title: string;
  about?: string;
  creator: string;
  admins?: string[];
  members?: string[];
};

type ContextProps = {
  workspace: null | string;
  workspaces: Workspace[];
  createWorkspace: (
    userId: string,
    data: any,
    token: string
  ) => Promise<string>;
  leaveWorkspace: (workspaceId: string) => void;
  setWorkspace: (workspaceId: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  isLoaded: boolean;
  deleteWorkspace: (
    userId: string,
    data: any,
    token: string
  ) => Promise<boolean>;
  updateWorkspace: (
    userId: string,
    data: any,
    token: string
  ) => Promise<boolean>;
};

type WorkspaceContextProps = {
  children: React.ReactNode;
};

const defaultWorkspace = {
  key: "personal",
  title: "My workspace",
  about: "",
  creator: "{{user}}",
  admins: ["{{user}}"],
  members: [],
};

const defaultContext = {
  workspace: null,
  workspaces: [defaultWorkspace],
  createWorkspace: async () => {
    return "";
  },
  leaveWorkspace: defaultFunc,
  setWorkspace: defaultFunc,
  setWorkspaces: defaultFunc,
  deleteWorkspace: async () => {
    return true;
  },
  updateWorkspace: async () => {
    return true;
  },
  isLoaded: false,
};

export const WorkspaceContext = createContext<ContextProps>(defaultContext);

export const WorkspaceContextProvider = ({
  children,
}: WorkspaceContextProps) => {
  // App main context
  const { user, token } = useGrinderyNexus();

  const access_token = token?.access_token;

  // Currently active workspace.
  const [workspace, setWorkspace] = useState<null | string>(null);

  // List of workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Is initial list of workspaces loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // Get list of user's workspaces
  const listWorkspaces = async (userId: string, token: string) => {
    const res = await workspacesRequest("or_listWorkspaces", {}, token);
    let spaces: Workspace[] = [];
    if (res && res.data && res.data.result) {
      console.log("or_listWorkspaces res", res.data.result);
      spaces = [...res.data.result];
    }

    setWorkspaces([
      replaceTokens(defaultWorkspace, { user: userId }),
      ...spaces,
    ]);
    setIsLoaded(true);
  };

  // Create new workspace
  const createWorkspace = async (userId: string, data: any, token: string) => {
    const res = await workspacesRequest("or_createWorkspace", data, token);
    if (res && res.data && res.data.result) {
      console.log("or_createWorkspace res", res.data.result);
      listWorkspaces(userId, token);
      if (res.data.result.key) {
        return res.data.result.key;
      }
    }
    return "";
  };

  // Update workspace
  const updateWorkspace = async (userId: string, data: any, token: string) => {
    const res = await workspacesRequest("or_updateWorkspace", data, token);
    if (res && res.data && res.data.result) {
      console.log("or_updateWorkspace res", res.data.result);
      listWorkspaces(userId, token);
      return true;
    }
    return false;
  };

  // Leave current workspace
  const leaveWorkspace = async (workspaceId: string) => {};

  // Delete workspace
  const deleteWorkspace = async (
    userId: string,
    workspaceKey: string,
    token: string
  ) => {
    const res = await workspacesRequest(
      "or_deleteWorkspace",
      { key: workspaceKey },
      token
    );
    if (res && res.data && res.data.result) {
      console.log("or_deleteWorkspace res", res.data.result);
      listWorkspaces(userId, token);
      return true;
    }
    return false;
  };

  // Get list of user's workspaces when user and access token is known
  useEffect(() => {
    if (user && access_token) {
      listWorkspaces(user, access_token);
    }
  }, [user, access_token]);

  useEffect(() => {
    if (!workspace && workspaces && workspaces.length > 0) {
      setWorkspace(workspaces[0].key);
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
        isLoaded,
        deleteWorkspace,
        updateWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContextProvider;
