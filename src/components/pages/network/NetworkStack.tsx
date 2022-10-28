import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CreateCDSPage from "./CreateCDSPage";
import EditCDSPage from "./EditCDSPage";
import Header from "../../network/Header";
import WelcomePage from "../WelcomePage";
import useAppContext from "../../../hooks/useAppContext";
import { NetworkContextProvider } from "../../../context/NetworkContext";

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
          <Header />
          <Routes>
            <Route path="/" element={<DashboardPage />}></Route>
            <Route
              path="/connector"
              element={<Navigate to="/network" replace />}
            ></Route>
            <Route path="/connector/new" element={<CreateCDSPage />}></Route>
            <Route path="/connector/:id" element={<EditCDSPage />}></Route>
            <Route path="/connector/:id/*" element={<EditCDSPage />}></Route>
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
