import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";
import { CircularProgress } from "grindery-ui";
import styled from "styled-components";
import useNetworkContext from "../../../hooks/useNetworkContext";
import ConnectorHomePage from "./ConnectorHomePage";
import ConnectorSettingsPage from "./ConnectorSettingsPage";
import ConnectorTriggersPage from "./ConnectorTriggersPage";
import ConnectorActionsPage from "./ConnectorActionsPage";
import ConnectorOperationPage from "./ConnectorOperationPage";
import ConnectorDrawer from "../../network/ConnectorDrawer";

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
  const [data, setData] = useState<any>({});
  const { connectors, connectorsLoading } = state;
  const connector = connectors.find(
    (c) => id && c.id.toString() === id.toString()
  );

  useEffect(() => {
    if (connector) {
      setData({
        id: connector.id,
        cds: JSON.parse(connector.values?.cds || {}),
      });
    }
  }, [connector]);

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
    <Container>
      <ConnectorDrawer connector={connector} data={data} />
      <Content>
        <Routes>
          <Route
            path="/"
            element={<ConnectorHomePage data={data} setData={setData} />}
          ></Route>
          <Route
            path="settings"
            element={<ConnectorSettingsPage data={data} setData={setData} />}
          />
          <Route
            path="triggers"
            element={<ConnectorTriggersPage data={data} setData={setData} />}
          />
          <Route
            path="triggers/:key"
            element={
              <ConnectorOperationPage
                type="triggers"
                data={data}
                setData={setData}
              />
            }
          />
          <Route
            path="actions"
            element={<ConnectorActionsPage data={data} setData={setData} />}
          />
          <Route
            path="actions/:key"
            element={
              <ConnectorOperationPage
                type="actions"
                data={data}
                setData={setData}
              />
            }
          />
          <Route path="publish" element={<div>Work in progress</div>} />
          <Route
            path="*"
            element={
              <Navigate to={`/network/connector/${connector.id}`} replace />
            }
          ></Route>
        </Routes>
      </Content>
    </Container>
  ) : (
    <Navigate to="/network" replace />
  );
};

export default EditConnectorPage;
