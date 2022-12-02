import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import { ThemeProvider } from "grindery-ui";
import SignInPage from "./components/pages/SignInPage";
import NexusStack from "./components/pages/NexusStack";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <BrowserRouter>
          <AppContextProvider>
            <Routes>
              <Route path="/sign-in" element={<SignInPage />}></Route>
              <Route path="*" element={<NexusStack />}></Route>
            </Routes>
          </AppContextProvider>
        </BrowserRouter>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
