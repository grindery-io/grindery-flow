import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { CircularProgress, Tabs } from "grindery-ui";
import { SCREEN } from "../../../constants";
import OperationFieldsEditor from "../../network/OperationFieldsEditor";
import useConnectorContext from "../../../hooks/useConnectorContext";
import OperationSettings from "../../network/OperationSettings";

const TABS = [
  { key: "settings", value: 0, title: "Settings" },
  { key: "inputFields", value: 1, title: "Input Fields" },
];

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const TabsWrapper = styled.div`
  margin-bottom: 0px;

  & .MuiTabs-root {
    background: none;
  }
  & .MuiTab-root {
    text-transform: initial;
    font-weight: 400;
    font-size: var(--text-size-horizontal-tab-label);
    line-height: 150%;
    font-weight: bold;

    @media (min-width: ${SCREEN.TABLET}) {
      min-width: 150px;
    }
  }

  & .MuiTabs-flexContainer {
    border-bottom: 1px solid #dcdcdc;
  }
`;

type Props = {};

const ConnectorOperationPage = (props: Props) => {
  let navigate = useNavigate();
  let { id, key, type, tab } = useParams();
  const { state } = useConnectorContext();
  const { cds } = state;

  const currentTab = TABS.find((t: any) => t.key === tab)?.value || 0;
  const operation =
    (type && cds?.[type].find((op: any) => op.key === key)) || null;

  useEffect(() => {
    if (!tab || !TABS.map((t: any) => t.key).includes(tab)) {
      navigate(`/network/connector/${id}/${type}/${key}/settings`);
    }
  }, [tab]);

  return operation ? (
    <div>
      <Title>
        {operation.display?.label || operation.name || operation.key || ""}
      </Title>
      <TabsWrapper>
        <Tabs
          value={currentTab}
          onChange={(index: number) => {
            const tabKey =
              TABS.find((t: any) => t.value === index)?.key || "settings";
            navigate(`/network/connector/${id}/${type}/${key}/${tabKey}`);
          }}
          options={TABS.map((t: any) => t.title)}
          orientation="horizontal"
          activeIndicatorColor="#FFB930"
          activeColor="#E48B05"
          type="text"
          tabColor=""
          variant={"standard"}
        />
      </TabsWrapper>

      {tab === "settings" && <OperationSettings />}
      {tab === "inputFields" && <OperationFieldsEditor />}
    </div>
  ) : (
    <>
      {cds ? (
        <Navigate to={`/network/connector/${id}/${type}`} replace />
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
      )}
    </>
  );
};

export default ConnectorOperationPage;
