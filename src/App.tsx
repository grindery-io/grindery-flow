import React from "react";
import AppRouter from "./components/AppRouter";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

export default App;
