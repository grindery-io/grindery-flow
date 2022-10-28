import React from "react";
import styled from "styled-components";
import { RichInput, CircularProgress } from "grindery-ui";
import Button from "../../network/Button";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const MaxHeightInput = styled.div`
  & .rich-input-box {
    max-height: 200px;
    overflow: auto;
  }
  & .rich-input div[data-slate-editor="true"] {
    overflow: auto !important;
  }
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

type Props = {
  data: any;
  setData: any;
};

const CDSSettingsPage = (props: Props) => {
  const { data, setData } = props;

  return data && data.cds ? (
    <div>
      <Title>Settings</Title>
      <div>
        <RichInput
          options={[]}
          value={data.cds.name}
          onChange={(value: string) => {
            setData((_data: any) => ({
              ..._data,
              cds: { ..._data.cds, name: value },
            }));
          }}
          required
          label="Connector name"
          placeholder="Connector name"
          singleLine
        />
        <MaxHeightInput>
          <RichInput
            options={[]}
            value={data.cds.icon}
            onChange={(value: string) => {
              setData((_data: any) => ({
                ..._data,
                cds: { ..._data.cds, icon: value },
              }));
            }}
            required
            label="Connector icon"
            tooltip="Image URL or base64 encoded string. Recommended icon size 40x40px. Allowed formats: PNG or SVG. Must be on transparent background."
            placeholder="Image URL or base64 encoded string"
          />
        </MaxHeightInput>
        <ButtonsWrapper>
          <ButtonsRight>
            <Button onClick={() => {}}>Save</Button>
          </ButtonsRight>
        </ButtonsWrapper>
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

export default CDSSettingsPage;
