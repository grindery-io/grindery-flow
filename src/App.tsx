import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyLoginProvider from "use-grindery-login";
import { ThemeProvider, CircularProgress } from "grindery-ui";
import NexusStack from "./components/pages/NexusStack";
import CompleteConnectorAuth from "./components/pages/CompleteConnectorAuth";
import WorkspaceContextProvider from "./context/WorkspaceContext";
import AppContextProvider from "./context/AppContext";
import { sendTwitterConversion } from "./utils/twitterTracking";
import SignInPageRedirect from "./components/pages/SignInPageRedirect";

function App() {
  useEffect(() => {
    sendTwitterConversion("tw-ofep3-ofep4");
  }, []);

  return (
    <ThemeProvider>
      <GrinderyLoginProvider
        loader={
          <div style={{ textAlign: "center", margin: "80px auto" }}>
            <CircularProgress />
          </div>
        }
        disconnectRedirectUrl="https://www.grindery.com/sign-out?sidebar_opened=1"
      >
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
            <Route path="/sign-in" element={<SignInPageRedirect />}></Route>
            <Route path="*" element={<NexusStack />}></Route>
          </Routes>
        </BrowserRouter>
      </GrinderyLoginProvider>
    </ThemeProvider>
  );
}

export default App;
