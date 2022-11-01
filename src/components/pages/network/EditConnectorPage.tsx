import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router";
import { CircularProgress } from "grindery-ui";
import styled from "styled-components";
import useNetworkContext from "../../../hooks/useNetworkContext";
import ConnectorHomePage from "./ConnectorHomePage";
import ConnectorSettingsPage from "./ConnectorSettingsPage";
import ConnectorOperationPage from "./ConnectorOperationPage";
import ConnectorDrawer from "../../network/ConnectorDrawer";
import ConnectorContextProvider from "../../../context/ConnectorContext";
import ConnectorOperationsPage from "./ConnectorOperationsPage";
import ConnectorAdvancedPage from "./ConnectorAdvancedPage";

const Container = styled.div`
  margin-left: 305px;
`;

const Content = styled.div`
  margin-top: 75px;
  padding: 40px 45px;
`;

type Props = {};

const EditConnectorPage = (props: Props) => {
  let { id } = useParams();
  const { state } = useNetworkContext();
  const { connectors, connectorsLoading } = state;
  const connector = connectors.find(
    (c) => id && c.id.toString() === id.toString()
  );

  if (connectorsLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#ffb930",
          width: "100%",
          margin: "100px 0",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return connector ? (
    <ConnectorContextProvider connector={connector}>
      <Container>
        <ConnectorDrawer />
        <Content>
          <Routes>
            <Route path="/" element={<ConnectorHomePage />}></Route>
            <Route path="settings" element={<ConnectorSettingsPage />} />
            <Route path="publish" element={<div>Not implemented yet</div>} />
            <Route path="advanced" element={<ConnectorAdvancedPage />} />
            <Route path=":type" element={<ConnectorOperationsPage />}></Route>
            <Route path=":type/:key" element={<ConnectorOperationPage />} />
            <Route
              path=":type/:key/:tab/*"
              element={<ConnectorOperationPage />}
            />
            <Route
              path="*"
              element={<Navigate to={`/network/connector/${id}`} replace />}
            ></Route>
          </Routes>
        </Content>
      </Container>
    </ConnectorContextProvider>
  ) : (
    <Navigate to="/network" replace />
  );
};

export default EditConnectorPage;
