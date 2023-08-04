import React from "react";
import { Route, Routes } from "react-router-dom";
import RootStack from "./RootStack";
import AuthPage from "./AuthPage";
import WorkspaceContextProvider from "../../context/WorkspaceContext";
import AppContextProvider from "../../context/AppContext";
import UserAuthController from "../shared/UserAuthController";

type Props = {};

const NexusStack = (props: Props) => {
  return (
    <WorkspaceContextProvider>
      <AppContextProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route
            path="*"
            element={
              <UserAuthController>
                <RootStack />
              </UserAuthController>
            }
          ></Route>
        </Routes>
      </AppContextProvider>
    </WorkspaceContextProvider>
  );
};

export default NexusStack;
