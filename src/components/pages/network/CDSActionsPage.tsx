import React from "react";
import styled from "styled-components";
import OperationRow from "../../network/OperationRow";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  & > tr > th {
    text-align: left;
  }
`;

const TableHeaderColumn = styled.th`
  padding: 15px 10px;
  font-weight: 400;
  font-weight: bold;
`;

type Props = {
  data: any;
  setData: any;
};

const CDSActionsPage = (props: Props) => {
  const { data } = props;

  return (
    <div>
      <Title>Actions</Title>
      <div>
        {data?.cds?.actions && data?.cds?.actions.length > 0 && (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderColumn>Label</TableHeaderColumn>
                <TableHeaderColumn>Key</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </tr>
            </TableHeader>
            <tbody>
              {data?.cds?.actions.map((action: any) => (
                <OperationRow
                  operation={action}
                  key={action.key}
                  type="actions"
                />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default CDSActionsPage;