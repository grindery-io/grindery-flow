import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import { ThemeProvider } from "grindery-ui";
import SignInPage from "./components/pages/SignInPage";
import NexusStack from "./components/pages/NexusStack";
import SignInContextProvider from "./context/SignInContext";
import CompleteConnectorAuth from "./components/pages/CompleteConnectorAuth";
import WorkspaceContextProvider from "./context/WorkspaceContext";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/complete_auth/:space"
              element={
                <WorkspaceContextProvider>
                  <AppContextProvider>
                    <CompleteConnectorAuth />
                  </AppContextProvider>
                </WorkspaceContextProvider>
              }
            ></Route>
            <Route
              path="/sign-in"
              element={
                <SignInContextProvider>
                  <SignInPage />
                </SignInContextProvider>
              }
            ></Route>
            <Route path="*" element={<NexusStack />}></Route>
          </Routes>
        </BrowserRouter>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
