import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { useNavigate } from "react-router";
import useConnectorContext from "../../../hooks/useConnectorContext";
import ReactJson from "@silizia/react-json-view";

const Container = styled.div`
  & .react-json-view {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

type Props = {};

const ConnectorAdvancedPage = (props: Props) => {
  let navigate = useNavigate();
  const { state, setState } = useConnectorContext();
  const { cds, id } = state;

  const addValue = (value: any) => {
    setState({
      cds: value,
    });
  };

  const editValue = (value: any) => {
    setState({
      cds: value,
    });
  };

  const deleteValue = (value: any) => {
    setState({
      cds: value,
    });
  };

  return cds ? (
    <Container>
      <Title>Edit Connector Source Code</Title>
      <div>
        {cds && (
          <ReactJson
            src={cds}
            onAdd={(add) => addValue(add.updated_src)}
            onEdit={(edit) => editValue(edit.updated_src)}
            onDelete={(edit) => deleteValue(edit.updated_src)}
            theme={"monokai"}
            collapsed={3}
            collapseStringsAfterLength={30}
            displayDataTypes={false}
          />
        )}
      </div>
    </Container>
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

export default ConnectorAdvancedPage;
