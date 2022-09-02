import React, { useState } from "react";
import styled from "styled-components";
import { RichInput, Alert } from "grindery-ui";
import Jdenticon from "react-jdenticon";
import CheckBox from "../shared/CheckBox";
import useAppContext from "../../hooks/useAppContext";
import Button from "../shared/Button";
import { getValidationScheme } from "../../helpers/utils";
import { ICONS } from "../../constants";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 604px;
  padding: 40px 20px;
  margin: 0 auto;

  h1 {
    font-weight: 700;
    font-size: 32px;
    line-height: 120%;
    color: #000000;
    margin: 0 0 16px;
    padding: 0;
  }

  h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 120%;
    color: #000000;
    padding: 0;
    margin: 24px 0 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #000000;
    padding: 0;
    margin: 0 0 16px;
  }

  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
    display: block;
  }
`;

const Box = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  padding: 40px;

  & .MuiTextField-root {
    margin-top: 0 !important;
  }

  & .MuiTypography-root {
    font-size: 14px;
  }

  & .rich-input {
    margin-bottom: 0 !important;
  }

  & .rich-input__label-tooltip {
    font-size: 14px !important;
    margin-bottom: 3.5px !important;
  }

  & .rich-input div[contenteditable="false"] {
    cursor: not-allowed;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: #f4f5f7;
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 60px;
    height: 60px;
    display: block;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  margin-top: 24px;
`;

const CheckboxLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
  cursor: pointer;
`;

const AlertWrapper = styled.div`
  margin-top: 24px;
`;

type Props = {};

const WorkspaceCreatePage = (props: Props) => {
  const { user, validator } = useAppContext();
  const { workspaces, setWorkspaces, setWorkspace } = useWorkspaceContext();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const userArr = user.split(":");
  const userAddress = userArr[userArr.length - 1];
  const [admin, setAdmin] = useState(userAddress);
  const [admins, setAdmins] = useState("");
  const [members, setMembers] = useState("");
  const [adminFieldKey, setAdminFieldKey] = useState(1);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<any>(false);

  let navigate = useNavigate();

  const validationSchema = getValidationScheme([
    { key: "name", required: true, type: "string" },
    { key: "admin", required: true, type: "evmAddress" },
    { key: "admins", required: false, type: "evmAddress", list: true },
    { key: "members", required: false, type: "evmAddress", list: true },
  ]);

  const check = validator.compile(validationSchema);

  const handleSubmit = () => {
    const validated = check({
      name,
      about,
      admin,
      admins: admins.split("\n"),
      members: members.split("\n"),
    });

    if (typeof validated === "boolean") {
      // all good
      const newWorkspace = {
        id: encodeURIComponent(name),
        name,
        about,
        admin: "eip155:1:" + admin,
        admins: admins.split("\n").map((address) => `eip155:1:${address}`),
        members: members.split("\n").map((address) => `eip155:1:${address}`),
      };
      setErrors(false);
      setFormError("");
      const newWorkspaces = [newWorkspace, ...workspaces];
      setWorkspaces(newWorkspaces);
      setWorkspace(newWorkspaces[0]);
      navigate("/");
    } else {
      setErrors(validated);
      setFormError("Please complete all required fields.");
    }
  };

  const fieldError = (fieldName: string, errors: any, includes?: boolean) => {
    return (
      (errors &&
        typeof errors !== "boolean" &&
        errors.length > 0 &&
        errors.find(
          (error: any) =>
            error &&
            (includes
              ? error.field.includes(fieldName)
              : error.field === fieldName)
        ) &&
        (
          errors.find(
            (error: any) =>
              error &&
              (includes
                ? error.field.includes(fieldName)
                : error.field === fieldName)
          ).message || ""
        ).replace(`'${fieldName}'`, "")) ||
      ""
    );
  };

  const updateErrors = (fieldName: string, errors: any, includes?: boolean) => {
    setFormError("");
    setErrors(
      typeof errors !== "boolean"
        ? [
            ...errors.filter(
              (error: any) =>
                error &&
                (includes
                  ? !error.field.includes(fieldName)
                  : error.field !== fieldName)
            ),
          ]
        : errors
    );
  };

  return (
    <Wrapper>
      <h1>Create New Workspace</h1>
      <p>
        Grindery Nexus is a free, open-source platform to connect Apps and dApps
        across chains and protocols. Create your own Workspace now to
        collaborate with teams and organize your Workflow lists.
      </p>
      <h3>Profile</h3>
      <Box>
        <div style={{ marginBottom: "24px" }}>
          <label>Avatar</label>
          <Avatar>
            <Jdenticon size="60" value={encodeURIComponent(name || "Avatar")} />
          </Avatar>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <RichInput
            label="Name"
            onChange={(value: string) => {
              setName(value);
              updateErrors("name", errors);
            }}
            value={name}
            placeholder="Enter workspace name"
            options={[]}
            error={fieldError("name", errors)}
            singleLine
          />
        </div>
        <div>
          <RichInput
            label="About"
            onChange={(value: string) => {
              setAbout(value);
            }}
            value={about}
            placeholder="Enter description"
            options={[]}
          />
        </div>
      </Box>
      <h3>Admin</h3>
      <p>
        The admin is the account that will be able to edit/manage a Workspace as
        well as invite and/or remove members and admins of a Workspace.
        Additional Workspace admins can be added later.
      </p>
      <Box>
        <RichInput
          key={adminFieldKey}
          label="Admin address"
          onChange={(value: string) => {
            setAdmin(value);
            updateErrors("admin", errors);
          }}
          value={admin}
          placeholder="0x0000000000000000000000000000"
          options={[]}
          error={fieldError("admin", errors)}
          singleLine
          readonly={admin === userAddress}
        />
        <CheckboxWrapper>
          <CheckBox
            checked={admin === userAddress}
            onChange={(val) => {
              if (val) {
                setAdmin(userAddress);
                setAdminFieldKey(adminFieldKey + 1);
              } else {
                setAdmin("");
                setAdminFieldKey(adminFieldKey + 1);
              }
              updateErrors("admin", errors);
            }}
          />
          <CheckboxLabel
            onClick={() => {
              if (admin === userAddress) {
                setAdmin("");
                setAdminFieldKey(adminFieldKey + 1);
              } else {
                setAdmin(userAddress);
                setAdminFieldKey(adminFieldKey + 1);
              }
              updateErrors("admin", errors);
            }}
          >
            Use currently logged in account.
          </CheckboxLabel>
        </CheckboxWrapper>
      </Box>
      <h3>Moderation</h3>
      <p>Who can manage this Workspace and create Workflows?</p>
      <Box>
        <div style={{ marginBottom: "24px" }}>
          <RichInput
            label="Admins"
            onChange={(value: string) => {
              setAdmins(value);
              updateErrors("admins[", errors, true);
            }}
            value={admins}
            placeholder="0x0000000000000000000000000000"
            options={[]}
            tooltip="Invite admins by EVM wallet address. Enter each address on the new line."
            error={fieldError("admins[", errors, true)}
          />
        </div>
        <div>
          <RichInput
            label="Members"
            onChange={(value: string) => {
              setMembers(value);
              updateErrors("members[", errors, true);
            }}
            value={members}
            placeholder="0x0000000000000000000000000000"
            options={[]}
            tooltip="Invite members by EVM wallet address. Enter each address on the new line."
            style={{ marginBottom: 0 }}
            error={fieldError("members[", errors, true)}
          />
        </div>
      </Box>
      {formError && (
        <AlertWrapper>
          <Alert
            color="error"
            icon={
              <img
                src={ICONS.ERROR_ALERT}
                width={20}
                height={20}
                alt="error icon"
              />
            }
          >
            <div style={{ textAlign: "left" }}>{formError}</div>
          </Alert>
        </AlertWrapper>
      )}
      <div style={{ marginTop: "14px" }}>
        <Button onClick={handleSubmit} value="Create Workspace" fullWidth />
      </div>
    </Wrapper>
  );
};

export default WorkspaceCreatePage;
