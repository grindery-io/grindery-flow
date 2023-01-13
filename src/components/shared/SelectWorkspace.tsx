import React from "react";
import styled from "styled-components";
import { Autocomplete } from "grindery-ui";
import Button from "./Button";
import useSignInContext from "../../hooks/useSignInContext";

const Wrapper = styled.div`
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`;

const FormWrapper = styled.div`
  padding: 30px;
  background: #ffffff;
`;

const FormContent = styled.div`
  max-width: 740px;
  margin: 0 auto;
  color: #000000;
`;

type Props = {};

const SelectWorkspace = (props: Props) => {
  const { workspaces, workspace, setWorkspace, getAuthCode, authCodeLoading } =
    useSignInContext();
  return (
    <Wrapper>
      <FormWrapper>
        <FormContent>
          <Autocomplete
            label="Workspace"
            placeholder="Select workspace"
            onChange={(value: string) => {
              setWorkspace(
                workspaces.find((ws) => ws && ws.key === value) || null
              );
            }}
            options={workspaces.map((ws) => ({
              label: ws.title,
              value: ws.key,
            }))}
            value={workspace?.key || ""}
          />
          <Button
            disabled={!workspace || authCodeLoading}
            value="Continue"
            onClick={() => {
              getAuthCode();
            }}
            loading={authCodeLoading}
          />
        </FormContent>
      </FormWrapper>
    </Wrapper>
  );
};

export default SelectWorkspace;
