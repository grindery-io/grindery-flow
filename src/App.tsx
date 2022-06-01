import React from "react";
import AppHeader from "./components/AppHeader";
import WorkflowConstructor from "./components/WorkflowConstructor";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <AppContextProvider>
      <AppHeader />
      <WorkflowConstructor />
    </AppContextProvider>
  );
}

export default App;
