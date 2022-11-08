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
  contributor: {
    loading: boolean;
    id?: string;
    username?: string;
    avatar?: string;
    url?: string;
    error?: string;
  };
};

type ContextProps = {
  state: StateProps;
  refreshConnectors: () => Promise<{ success: boolean }>;
  cloneConnector: (cds: any) => Promise<string>;
  connectContributor: (code: string) => void;
};

type NetworkContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    connectors: [],
    connectorsLoading: true,
    blockchains: [],
    contributor: {
      loading: true,
    },
  },
  refreshConnectors: async () => {
    return { success: false };
  },
  cloneConnector: async () => {
    return "";
  },
  connectContributor: () => {},
};

export const NetworkContext = createContext<ContextProps>(defaultContext);

export const NetworkContextProvider = ({ children }: NetworkContextProps) => {
  const { workspaceToken, workspace } = useWorkspaceContext();
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
      contributor: {
        loading: true,
      },
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
        connectors:
          res?.data?.result?.filter(
            (connector: any) =>
              ((!workspace || workspace === "personal") &&
                !connector?.values?.workspace) ||
              (workspace && workspace !== "personal")
          ) || [],
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
        connectors:
          res?.data?.result?.filter(
            (connector: any) =>
              (workspace === "personal" && !connector?.values?.workspace) ||
              workspace !== "personal"
          ) || [],
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

  const cloneConnector = async (cds: any) => {
    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds/clone`,
        {
          cds: JSON.stringify(cds),
          username: state.contributor?.username || "",
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("cloneCDS error", err);
      throw new Error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error"
      );
    }
    if (res?.data?.key) {
      return res.data.key;
    } else {
      throw new Error("Server error. Please, try again later.");
    }
  };

  const getContributor = async () => {
    let res;
    try {
      res = await axios.get(
        `${CDS_EDITOR_API_ENDPOINT}/contributor?environment=${
          isLocalOrStaging ? "staging" : "production"
        }`,
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("getContributor error", err);
      setState({
        contributor: {
          loading: false,
          error:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Server error",
        },
      });
    }

    setState({
      contributor: {
        loading: false,
        error: undefined,
        id: res?.data?.id,
        username: res?.data?.username,
        avatar: res?.data?.avatar,
        url: res?.data?.url,
      },
    });
  };

  const connectContributor = async (code: string) => {
    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/contributor`,
        {
          code,
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("connectContributor error", err);
      setState({
        contributor: {
          loading: false,
          error:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Server error",
        },
      });
      return;
    }

    setState({
      contributor: {
        loading: false,
        error: undefined,
        id: res?.data?.id,
        username: res?.data?.username,
        avatar: res?.data?.avatar,
        url: res?.data?.url,
      },
    });
  };

  useEffect(() => {
    getContributor();
  }, []);

  useEffect(() => {
    getConnectors(token?.access_token, workspaceToken);
  }, [token?.access_token, workspaceToken]);

  useEffect(() => {
    getChains(token?.access_token);
  }, [token?.access_token]);

  return (
    <NetworkContext.Provider
      value={{ state, refreshConnectors, cloneConnector, connectContributor }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContextProvider;
