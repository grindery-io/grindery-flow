import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CreateConnectorPage from "./CreateConnectorPage";
import WelcomePage from "../WelcomePage";
import useAppContext from "../../../hooks/useAppContext";
import { NetworkContextProvider } from "../../../context/NetworkContext";
import EditConnectorPage from "./EditConnectorPage";
import NetworkHeader from "../../network/NetworkHeader";

type Props = {};

const DevStack = (props: Props) => {
  const { user } = useAppContext();
  return (
    <>
      {!user ? (
        <div style={{ padding: "40px 20px" }}>
          <WelcomePage />
        </div>
      ) : (
        <NetworkContextProvider>
          <NetworkHeader />
          <Routes>
            <Route path="/" element={<DashboardPage />}></Route>
            <Route
              path="/connector"
              element={<Navigate to="/network" replace />}
            ></Route>
            <Route
              path="/connector/new"
              element={<CreateConnectorPage />}
            ></Route>
            <Route
              path="/connector/:id"
              element={<EditConnectorPage />}
            ></Route>
            <Route
              path="/connector/:id/*"
              element={<EditConnectorPage />}
            ></Route>
            <Route
              path="*"
              element={<Navigate to="/network" replace />}
            ></Route>
          </Routes>
        </NetworkContextProvider>
      )}
    </>
  );
};

export default DevStack;
