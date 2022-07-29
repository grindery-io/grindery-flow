import React from "react";
import AppContextProvider from "./context/AppContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootPage from "./components/pages/RootPage";
import AuthPage from "./components/pages/AuthPage";
import EarlyAccessModal from "./components/shared/EarlyAccessModal";
import GrinderyNexusContextProvider from "use-grindery-nexus";

function App() {
  return (
    <GrinderyNexusContextProvider>
      <BrowserRouter>
        <AppContextProvider>
          <EarlyAccessModal />
          <Routes>
            <Route path="/auth" element={<AuthPage />}></Route>
            <Route path="*" element={<RootPage />}></Route>
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </GrinderyNexusContextProvider>
  );
}

export default App;
