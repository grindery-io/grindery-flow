import React from "react";
import AppContextProvider from "../../context/AppContext";
import { Route, Routes } from "react-router-dom";
import RootStack from "./RootStack";
import AuthPage from "./AuthPage";
import EarlyAccessModal from "../shared/EarlyAccessModal";
import WorkspaceContextProvider from "../../context/WorkspaceContext";

type Props = {};

const NexusStack = (props: Props) => {
  return (
    <WorkspaceContextProvider>
      <AppContextProvider>
        <EarlyAccessModal />
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="*" element={<RootStack />}></Route>
        </Routes>
      </AppContextProvider>
    </WorkspaceContextProvider>
  );
};

export default NexusStack;
