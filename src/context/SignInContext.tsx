import React, { useState, createContext, useEffect } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import NexusClient from "grindery-nexus-client";

type ContextProps = {
  user: any;
  accessAllowed: boolean;
  verifying: boolean;
  client: NexusClient | null;
};

type SignInContextProps = {
  children: React.ReactNode;
};

export const SignInContext = createContext<ContextProps>({
  user: "",
  accessAllowed: false,
  verifying: true,
  client: null,
});

export const SignInContextProvider = ({ children }: SignInContextProps) => {
  const { user, token } = useGrinderyNexus();

  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);

  // verification state
  const [verifying, setVerifying] = useState<boolean>(true);

  // Nexus API client
  const [client, setClient] = useState<NexusClient | null>(null);

  const verifyUser = async () => {
    setVerifying(true);
    const res = await client?.isAllowedUser("gateway").catch((err) => {
      console.error("isAllowedUser error:", err.message);
      setAccessAllowed(false);
    });
    if (res) {
      setAccessAllowed(true);
    } else {
      setAccessAllowed(false);
    }
    setVerifying(false);
  };

  const initClient = (accessToken: string) => {
    const nexus = new NexusClient();
    nexus.authenticate(accessToken);
    setClient(nexus);
  };

  useEffect(() => {
    if (user && client) {
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, client]);

  // verify user on success authentication
  useEffect(() => {
    if (user && token?.access_token) {
      initClient(token?.access_token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token?.access_token]);

  return (
    <SignInContext.Provider
      value={{
        user,
        accessAllowed,
        verifying,
        client,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export default SignInContextProvider;
