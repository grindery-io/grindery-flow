import React from "react";
import { Provider } from "@self.id/framework";
import AppContextProvider from "./context/AppContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootPage from "./components/pages/RootPage";
import AuthPage from "./components/pages/AuthPage";
import EarlyAccessModal from "./components/shared/EarlyAccessModal";

function App() {
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <BrowserRouter>
        <AppContextProvider>
          <EarlyAccessModal />
          <Routes>
            <Route path="/auth" element={<AuthPage />}></Route>
            <Route path="*" element={<RootPage />}></Route>
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
