import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
              <div style={{ padding: "60px 20px 50px" }}>
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
