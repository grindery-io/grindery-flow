import React from "react";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import { StateProps } from "./ConnectorSubmission";
import Button from "./Button";

const Container = styled.div`
  max-width: 816px;
  margin: 0 auto;
  padding: 64px 106px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  text-align: center;
  color: #0b0d17;
  margin: 0 0 32px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  margin: 12px 0 0;
  text-align: center;
`;

const MaxHeightInput = styled.div`
  & .rich-input-box {
    max-height: 150px;
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
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const Error = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: rgb(255, 88, 88);
  margin: 0 0 20px;
  padding: 0;
`;

type Props = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
  onSubmit: () => void;
};

const ConnectorSubmissionStep2 = (props: Props) => {
  const { state, setState, onSubmit } = props;

  return (
    <Container>
      <Title>Provide details about Connector and yourself</Title>

      <RichInput
        label="GitHub Username"
        placeholder="username"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              contributor: { ...state.form.contributor, username: value },
            },
          });
        }}
        value={state.form.contributor.username}
        options={[]}
        singleLine
        required
        error={state.error.type === "username" ? state.error.text : ""}
        tooltip="Create GitHub account at https://github.com/join if you don't have one."
      />

      <RichInput
        label="Connector Name"
        placeholder="My Connector"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, name: value },
            },
          });
        }}
        value={state.form.entry.name}
        options={[]}
        singleLine
        required
        error={state.error.type === "name" ? state.error.text : ""}
      />

      <RichInput
        label="Connector Description"
        placeholder="Short description for your Connector"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, description: value },
            },
          });
        }}
        value={state.form.entry.description}
        options={[]}
        error={state.error.type === "description" ? state.error.text : ""}
      />

      <MaxHeightInput>
        <RichInput
          label="Connector Icon"
          placeholder="Image URL or base64 encoded string"
          onChange={(value: string) => {
            setState({
              error: { type: "", text: "" },
              form: {
                ...state.form,
                entry: { ...state.form.entry, icon: value },
              },
            });
          }}
          value={state.form.entry.icon}
          options={[]}
          error={state.error.type === "icon" ? state.error.text : ""}
          tooltip="Image URL or base64 encoded string. Recommended icon size 24x24px. Allowed formats: PNG or SVG. Must be on transparent background."
          required
        />
      </MaxHeightInput>
      {state.error.type === "cds" && <Error>{state.error.text}</Error>}
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            style={{
              background: "#FFFFFF",
              border: "1px solid #0B0D17",
              color: "#0B0D17",
            }}
            onClick={() => {
              setState({ step: state.step - 1 });
            }}
          >
            Back
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button onClick={onSubmit}>Continue</Button>
        </ButtonWrapper>
      </ButtonsWrapper>
    </Container>
  );
};

export default ConnectorSubmissionStep2;
