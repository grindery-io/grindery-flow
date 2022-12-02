import React from "react";
import { Route, Routes } from "react-router-dom";
import RootStack from "./RootStack";
import AuthPage from "./AuthPage";
import EarlyAccessModal from "../shared/EarlyAccessModal";
import WorkspaceContextProvider from "../../context/WorkspaceContext";
import NetworkStack from "./network/NetworkStack";

type Props = {};

const NexusStack = (props: Props) => {
  return (
    <WorkspaceContextProvider>
      <EarlyAccessModal />
      <Routes>
        <Route path="/auth" element={<AuthPage />}></Route>
        <Route path="/github/auth" element={<AuthPage />}></Route>
        <Route path="/network/*" element={<NetworkStack />} />
        <Route path="*" element={<RootStack />}></Route>
      </Routes>
    </WorkspaceContextProvider>
  );
};

export default NexusStack;
