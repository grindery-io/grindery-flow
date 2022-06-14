import React from "react";
import { Provider } from "@self.id/react";
import AppRouter from "./components/shared/AppRouter";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </Provider>
  );
}

export default App;
