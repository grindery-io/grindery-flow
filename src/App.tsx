import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import AuthenticationHandler from "./components/AuthenticationHandler";
import WorkflowConstructor from "./components/WorkflowConstructor";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  maxWidth: 375,
                  margin: "0 0 0 auto",
                  borderLeft: "1px solid #DCDCDC",
                  borderRight: "1px solid #DCDCDC",
                  minHeight: "100vh",
                  background: "#FFFFFF",
                }}
              >
                <AppHeader />
                <WorkflowConstructor />
              </div>
            }
          ></Route>
          <Route path="/auth" element={<AuthenticationHandler />}></Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
