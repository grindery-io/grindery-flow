import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Drawer } from "grindery-ui";
import styled from "styled-components";
import ConnectorDrawerHeader from "./ConnectorDrawerHeader";

const DrawerWrapper = styled.div`
  .MuiPaper-root {
    transform: none !important;
    visibility: visible !important;
    width: 305px;
    background: #f4f5f7;
    border-right: 1px solid #dcdcdc;
  }
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

type Props = {
  data: any;
  connector: any;
};

const ConnectorDrawer = (props: Props) => {
  const { data, connector } = props;
  let naigate = useNavigate();
  let location = useLocation();
  return (
    <DrawerWrapper>
      <Drawer open anchor="left" variant="persistent">
        <div style={{ minHeight: "75px" }}></div>
        <ConnectorDrawerHeader connector={connector} />
        <div>
          <ConnectorMenuHeader>BUILD</ConnectorMenuHeader>
          <ConnectorMenu>
            <li>
              <span
                className={
                  location.pathname === `/network/connector/${connector.id}`
                    ? "active"
                    : ""
                }
                onClick={() => {
                  naigate(`/network/connector/${connector.id}`);
                }}
              >
                Connector Home
              </span>
            </li>
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
      </Drawer>
    </DrawerWrapper>
  );
};

export default ConnectorDrawer;
