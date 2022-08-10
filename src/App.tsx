import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import SignInPage from "./components/pages/SignInPage";
import NexusStack from "./components/pages/NexusStack";

function App() {
  return (
    <GrinderyNexusContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />}></Route>
          <Route path="*" element={<NexusStack />}></Route>
        </Routes>
      </BrowserRouter>
    </GrinderyNexusContextProvider>
  );
}

export default App;
