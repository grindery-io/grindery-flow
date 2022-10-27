import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import useNetworkContext from "../../../hooks/useNetworkContext";
import Button from "../../shared/Button";

const Container = styled.div`
  padding: 0 20px;
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
  & > tr > th:last-child {
    text-align: right;
  }
`;

const TableHeaderColumn = styled.th`
  text-align: left;
  padding: 20px 20px;
  font-weight: 400;
`;

const Row = styled.tr`
  border: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 20px;
  }
  & > td:last-child {
    padding-right: 20px;
    text-align: right;
  }
`;

const Column = styled.td`
  padding: 20px 10px;
`;

const Icon = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 8px;
  width: 40px;
  box-sizing: border-box;

  & img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const ConnectorName = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  color: #141416;
  padding: 0;
  margin: 0;
`;

type Props = {};

const DashboardPage = (props: Props) => {
  const { state } = useNetworkContext();

  return (
    <Container>
      <Content>
        <PageHeader>
          <h1>Connectors</h1>
          <Button value="Create connector" />
        </PageHeader>

        {state.cdssLoading ? (
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
            {state.cdss && state.cdss.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderColumn colSpan={2}>NAME</TableHeaderColumn>
                      <TableHeaderColumn>STATUS</TableHeaderColumn>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {state.cdss.map((cds) => (
                      <Row key={cds.id}>
                        <Column style={{ width: "40px" }}>
                          <Icon>
                            <img src={cds.values?.["11"] || ""} alt="" />
                          </Icon>
                        </Column>
                        <Column>
                          <ConnectorName>
                            {cds.values?.["1"] || cds.id}
                          </ConnectorName>
                        </Column>
                        <Column>{cds.values?.["6"]?.name || ""}</Column>
                      </Row>
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
