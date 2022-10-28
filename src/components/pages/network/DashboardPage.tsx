import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import useNetworkContext from "../../../hooks/useNetworkContext";
import Button from "../../shared/Button";
import { useNavigate } from "react-router";
import ConnectorRow from "../../network/ConnectorRow";

const Container = styled.div`
  padding: 92px 20px 0;
`;

const Content = styled.div`
  max-width: 815px;
  margin: 60px auto;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  margin: 0 0 40px;

  h1 {
    font-weight: 700;
    font-size: 25px;
    line-height: 120%;
    color: #000000;
    padding: 0;
    margin: 0;
  }

  & > div {
    margin-left: auto;

    & button {
      margin: 0;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  & > tr > th {
    text-align: right;
  }
  & > tr > th:first-child {
    text-align: left;
  }
`;

const TableHeaderColumn = styled.th`
  padding: 20px 20px;
  font-weight: 400;
`;

type Props = {};

const DashboardPage = (props: Props) => {
  let navigate = useNavigate();
  const { state } = useNetworkContext();

  return (
    <Container>
      <Content>
        <PageHeader>
          <h1>Connectors</h1>
          <Button
            value="Create connector"
            onClick={() => {
              navigate("/network/connector/new");
            }}
          />
        </PageHeader>

        {state.connectorsLoading ? (
          <div
            style={{
              textAlign: "center",
              color: "#8C30F5",
              width: "100%",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            {state.connectors && state.connectors.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderColumn colSpan={2}>NAME</TableHeaderColumn>
                      <TableHeaderColumn>TYPE</TableHeaderColumn>
                      <TableHeaderColumn>STATUS</TableHeaderColumn>
                      <TableHeaderColumn></TableHeaderColumn>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {state.connectors.map((connector) => (
                      <ConnectorRow connector={connector} key={connector.id} />
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <p>You have not created any connectors yet.</p>
              </>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default DashboardPage;
