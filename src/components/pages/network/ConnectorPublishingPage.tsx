import React, { useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import { useNavigate } from "react-router";
import useConnectorContext from "../../../hooks/useConnectorContext";
import RadioButton from "../../network/RadioButton";
import useWorkspaceContext from "../../../hooks/useWorkspaceContext";
import ConnectorContributor from "../../network/ConnectorContributor";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  width: 100%;
`;

const CardTitle = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 0;
  color: #0b0d17;
`;

const CardDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 10px 0 0;
  padding: 0;
  color: #898989;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 4px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ConnectorDetails = styled.div`
  margin-top: 10px;

  & p {
    margin: 0 0 8px;
    padding: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;

  & tbody tr {
    border-bottom: 1px solid #dcdcdc;

    & td {
      padding: 10px;
    }

    & td:first-child {
      width: 30%;
      padding-left: 0;
      font-size: 14px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

type Props = {};

const ConnectorPublishingPage = (props: Props) => {
  let navigate = useNavigate();
  const { state } = useConnectorContext();
  const { cds } = state;
  const { workspace } = useWorkspaceContext();
  const { id } = state;
  const [type, setType] = useState("Private");

  return id ? (
    <div>
      <Title>Publishing</Title>
      <div>
        <Card>
          <CardContent>
            <CardTitle>Connector Access</CardTitle>
            <CardDescription>
              Who will be able to use your connector in Nexus?
            </CardDescription>
            <RadioWrapper>
              <RadioButton
                label="Private"
                selected={type === "Private"}
                onChange={() => {
                  setType("Private");
                }}
                description="Only you will be able to use Connector"
              />

              {workspace !== "personal" && (
                <RadioButton
                  label="Workspace"
                  selected={type === "Workspace"}
                  onChange={() => {
                    setType("Workspace");
                  }}
                  description="Connector will be available for all members of the workspace"
                />
              )}

              <RadioButton
                label="Public"
                selected={type === "Public"}
                onChange={() => {
                  setType("Public");
                }}
                description="Connector will be available for all Nexus users"
              />
            </RadioWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Connector Summary</CardTitle>
            <CardDescription>
              Review Connector details before publishing.
            </CardDescription>
            <ConnectorDetails>
              <Table>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{cds.name}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{cds.description}</td>
                  </tr>
                  <tr>
                    <td>Access</td>
                    <td>{type}</td>
                  </tr>
                  {state.connector?.values?.contract_address && (
                    <tr>
                      <td>Smart-contract address</td>
                      <td>{state.connector?.values?.contract_address}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Number of triggers</td>
                    <td>{cds.triggers.length}</td>
                  </tr>
                  <tr>
                    <td>Number of actions</td>
                    <td>{cds.actions.length}</td>
                  </tr>
                  {state.connector?.values?.contributor && (
                    <tr>
                      <td>Creator</td>
                      <td>
                        <ConnectorContributor
                          contributor={state.connector?.values?.contributor}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </ConnectorDetails>
          </CardContent>
        </Card>
        <Button
          onClick={() => {
            alert("Not implemented yet");
          }}
        >
          Submit Connector
        </Button>
      </div>
    </div>
  ) : (
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
};

export default ConnectorPublishingPage;
