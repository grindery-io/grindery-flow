import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import styled from "styled-components";
import { RichInput, CircularProgress, Tabs } from "grindery-ui";
import Button from "../../network/Button";
import { SCREEN } from "../../../constants";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 32px;
`;

const ButtonsRight = styled.div`
  margin-left: auto;
`;

const TabsWrapper = styled.div`
  margin-bottom: 20px;

  & .MuiTabs-root {
    background: none;
    border-bottom: 1px solid #dcdcdc;
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
`;

type Props = {
  type: string;
  data: any;
  setData: any;
};

const CDSOperationPage = (props: Props) => {
  let { id, key } = useParams();
  const { data, type } = props;
  const [tab, setTab] = useState(0);
  const operation = data?.cds?.[type].find((op: any) => op.key == key) || null;

  useEffect(() => {
    setTab(0);
  }, [key]);

  return operation ? (
    <div>
      <Title>
        {operation.display?.label || operation.name || operation.key || ""}
      </Title>
      <TabsWrapper>
        <Tabs
          value={tab}
          onChange={(index: number) => {
            setTab(index);
          }}
          options={["Settings", "Input Fields"]}
          orientation="horizontal"
          activeIndicatorColor="#FFB930"
          activeColor="#E48B05"
          type="text"
          tabColor=""
          variant={""}
        />
      </TabsWrapper>
      {tab == 0 && (
        <>
          <div>
            <RichInput
              key={`${key}_key`}
              label="Key"
              value={operation.key}
              onChange={() => {}}
              singleLine
              required
              tooltip="Enter a unique word or phrase without spaces to reference this operation inside Nexus. Not seen by users. Example: new_ticket."
              options={[]}
            />
            <RichInput
              key={`${key}_name`}
              label="Name"
              value={operation.name}
              onChange={() => {}}
              singleLine
              required
              tooltip="Enter a user friendly name for this operation that describes what makes it run. Shown to users inside Nexus. Example: New Ticket."
              options={[]}
            />
            <RichInput
              key={`${key}_description`}
              label="Description"
              value={operation.display?.description || ""}
              onChange={() => {}}
              required
              tooltip="Describe clearly the purpose of this operation in a complete sentence. Example: Triggers when a new support ticket is created."
              options={[]}
            />
          </div>
          <ButtonsWrapper>
            <ButtonsRight>
              <Button onClick={() => {}}>Save</Button>
            </ButtonsRight>
          </ButtonsWrapper>
        </>
      )}
    </div>
  ) : (
    <>
      {data?.cds ? (
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

export default CDSOperationPage;
