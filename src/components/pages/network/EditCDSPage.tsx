import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { Drawer, CircularProgress } from "grindery-ui";
import styled from "styled-components";
import useNetworkContext from "../../../hooks/useNetworkContext";
import CDSSettingsPage from "./CDSSettingsPage";
import Button from "../../network/Button";
import CDSTriggersPage from "./CDSTriggersPage";
import CDSActionsPage from "./CDSActionsPage";
import CDSOperationPage from "./CDSOperationPage";

const Container = styled.div`
  margin-left: 305px;
`;

const Content = styled.div`
  margin-top: 92px;
  padding: 40px 45px;
`;

const DrawerWrapper = styled.div`
  .MuiPaper-root {
    transform: none !important;
    visibility: visible !important;
    width: 305px;
    background: #f4f5f7;
    border-right: 1px solid #dcdcdc;
  }
`;

const ConnectorHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #dcdcdc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  position: sticky;
  top: 92px;
  background: #f4f5f7;
`;

const ConnectorIcon = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;

  & img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const ConnectorName = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #141416;
  margin: 0;
  padding: 0;
`;

const ConnectorMenuHeader = styled.h4`
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-transform: uppercase;
  color: #898989;
  margin: 0;
  padding: 15px 20px;
`;

const ConnectorMenu = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;

  & > li {
    padding: 0;
    margin: 0;
    & > span {
      display: block;
      padding: 15px 15px 15px 40px;
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
      color: #141416;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      &.active,
      &.active:hover {
        background: #ffb930;
      }
    }

    & > ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      & > li {
        margin: 0;
        padding: 0;
        & > span {
          display: block;
          padding: 15px 15px 15px 60px;
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          color: #141416;
          cursor: pointer;

          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }

          &.active,
          &.active:hover {
            background: #ffb930;
          }
        }
      }
    }
  }
`;

const PublishButton = styled.div`
  padding: 40px 20px;
  text-align: center;
  }
`;

type Props = {};

const EditCDSPage = (props: Props) => {
  let { id } = useParams();
  let naigate = useNavigate();
  const { state } = useNetworkContext();
  const [data, setData] = useState<any>({});
  const { connectors, connectorsLoading } = state;
  const connector = connectors.find(
    (c) => id && c.id.toString() === id.toString()
  );
  let location = useLocation();

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
          color: "#8C30F5",
          width: "100%",
          margin: "40px 0",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return connector ? (
    <Container>
      <DrawerWrapper>
        <Drawer open anchor="left" variant="persistent">
          <div style={{ minHeight: "92px" }}></div>
          <ConnectorHeader>
            <ConnectorIcon>
              <img src={connector.values.icon} alt={connector.values.name} />
            </ConnectorIcon>
            <ConnectorName>{connector.values.name}</ConnectorName>
          </ConnectorHeader>
          <div>
            <ConnectorMenuHeader>BUILD</ConnectorMenuHeader>
            <ConnectorMenu>
              <li>
                <span
                  className={
                    location.pathname ===
                    `/network/connector/${connector.id}/settings`
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    naigate(`/network/connector/${connector.id}/settings`);
                  }}
                >
                  Settings
                </span>
              </li>
              <li>
                <span
                  className={
                    location.pathname ===
                    `/network/connector/${connector.id}/triggers`
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    naigate(`/network/connector/${connector.id}/triggers`);
                  }}
                >
                  Triggers
                </span>
                {data?.cds?.triggers && data?.cds?.triggers.length > 0 && (
                  <ul>
                    {data?.cds?.triggers.map((trigger: any) => (
                      <li key={trigger.key}>
                        <span
                          className={
                            location.pathname ===
                            `/network/connector/${connector.id}/triggers/${trigger.key}`
                              ? "active"
                              : ""
                          }
                          onClick={() => {
                            naigate(
                              `/network/connector/${connector.id}/triggers/${trigger.key}`
                            );
                          }}
                        >
                          {trigger.display?.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <span
                  className={
                    location.pathname ===
                    `/network/connector/${connector.id}/actions`
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    naigate(`/network/connector/${connector.id}/actions`);
                  }}
                >
                  Actions
                </span>
                {data?.cds?.actions && data?.cds?.actions.length > 0 && (
                  <ul>
                    {data?.cds?.actions.map((action: any) => (
                      <li key={action.key}>
                        <span
                          className={
                            location.pathname ===
                            `/network/connector/${connector.id}/actions/${action.key}`
                              ? "active"
                              : ""
                          }
                          onClick={() => {
                            naigate(
                              `/network/connector/${connector.id}/actions/${action.key}`
                            );
                          }}
                        >
                          {action.display?.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ConnectorMenu>
          </div>
          <PublishButton>
            <Button onClick={() => {}}>Publish connector</Button>
          </PublishButton>
        </Drawer>
      </DrawerWrapper>
      <Content>
        <Routes>
          <Route path="/" element={<Navigate to="settings" replace />}></Route>
          <Route
            path="settings"
            element={<CDSSettingsPage data={data} setData={setData} />}
          />
          <Route
            path="triggers"
            element={<CDSTriggersPage data={data} setData={setData} />}
          />
          <Route
            path="triggers/:key"
            element={
              <CDSOperationPage type="triggers" data={data} setData={setData} />
            }
          />
          <Route
            path="actions"
            element={<CDSActionsPage data={data} setData={setData} />}
          />
          <Route
            path="actions/:key"
            element={
              <CDSOperationPage type="actions" data={data} setData={setData} />
            }
          />
          <Route path="*" element={<Navigate to="settings" replace />}></Route>
        </Routes>
      </Content>
    </Container>
  ) : (
    <Navigate to="/network" replace />
  );
};

export default EditCDSPage;
