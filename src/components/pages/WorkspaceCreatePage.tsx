import React, { useState } from "react";
import styled from "styled-components";
import { RichInput, Alert } from "grindery-ui";
import Jdenticon from "react-jdenticon";
//import CheckBox from "../shared/CheckBox";
import useAppContext from "../../hooks/useAppContext";
import Button from "../shared/Button";
import { getValidationScheme } from "../../helpers/utils";
import { ICONS } from "../../constants";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router-dom";

const STRINGS = {
  TITLE: "Create New Workspace",
  DESCRIPTION:
    "Grindery Nexus is a free, open-source platform to connect Apps and dApps across chains and protocols. Create your own Workspace now to collaborate with teams and organize your Workflow lists.",
  SECTION_TITLE_1: "Profile",
  FIELDS: {
    AVATAR: {
      LABEL: "Avatar",
    },
    NAME: {
      LABEL: "Name",
      PLACEHOLDER: "Enter workspace name",
    },
    ABOUT: {
      LABEL: "About",
      PLACEHOLDER: "Enter description",
    },
    ADMIN: {
      LABEL: "Admin address",
      PLACEHOLDER: "0x0000000000000000000000000000",
    },
    ADMIN_CHECKBOX: {
      LABEL: "Use currently loggen in account.",
    },
    ADMINS: {
      LABEL: "Admins",
      PLACEHOLDER: "0x0000000000000000000000000000",
      TOOLTIP:
        "Admins can create, edit, delete, enable, disable workflows associated with this workspace; Edit, delete the workspace itself; Invite new members and admins to the workspace.\n\nInvite admins by EVM wallet address. Enter each address on the new line.",
    },
    MEMBERS: {
      LABEL: "Members",
      PLACEHOLDER: "0x0000000000000000000000000000",
      TOOLTIP:
        "Members can create, edit, delete, enable, disable workflows associated with this workspace.\n\nInvite members by EVM wallet address. Enter each address on the new line.",
    },
  },
  SECTION_TITLE_2: "Admin",
  SECTION_DESCRIPTION_2:
    "The admin is the account that will be able to edit/manage a Workspace as well as invite and/or remove members and admins of a Workspace. Additional Workspace admins can be added later.",
  SECTION_TITLE_3: "Moderation",
  SECTION_DESCRIPTION_3: "Who can manage this Workspace and create Workflows?",
  SUBMIT_BUTTON: "Create Workspace",
};

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

/*const CheckboxWrapper = styled.div`
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
`;*/

const AlertWrapper = styled.div`
  margin-top: 24px;
`;

type Props = {};

const WorkspaceCreatePage = (props: Props) => {
  const { user, validator, access_token } = useAppContext();
  const { setWorkspace, createWorkspace } = useWorkspaceContext();
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  //const userArr = user.split(":");
  //const userAddress = userArr[userArr.length - 1];
  //const [admin, setAdmin] = useState(userAddress);
  const [admins, setAdmins] = useState(user.replace("eip155:1:", ""));
  const [members, setMembers] = useState("");
  //const [adminFieldKey, setAdminFieldKey] = useState(1);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<any>(false);

  let navigate = useNavigate();

  const validationSchema = getValidationScheme([
    { key: "title", required: true, type: "string" },
    { key: "admins", required: false, type: "evmAddress", list: true },
    { key: "members", required: false, type: "evmAddress", list: true },
  ]);

  const check = validator.compile(validationSchema);

  const handleSubmit = async () => {
    const validated = check({
      title,
      about,
      admins: admins.split("\n"),
      members: members.split("\n"),
    });

    if (typeof validated === "boolean") {
      setErrors(false);
      setFormError("");
      const newWorkspace = {
        title,
      };
      const key = await createWorkspace(user, newWorkspace, access_token || "");
      setWorkspace(key);
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
      <h1>{STRINGS.TITLE}</h1>
      <p>{STRINGS.DESCRIPTION}</p>
      <h3>{STRINGS.SECTION_TITLE_1}</h3>
      <Box>
        <div style={{ marginBottom: "24px" }}>
          <label>{STRINGS.FIELDS.AVATAR.LABEL}</label>
          <Avatar>
            <Jdenticon
              size="60"
              value={encodeURIComponent(title || "Avatar")}
            />
          </Avatar>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <RichInput
            label={STRINGS.FIELDS.NAME.LABEL}
            onChange={(value: string) => {
              setTitle(value);
              updateErrors("title", errors);
            }}
            value={title}
            placeholder={STRINGS.FIELDS.NAME.PLACEHOLDER}
            options={[]}
            error={fieldError("title", errors)}
            singleLine
          />
        </div>
        {/*<div>
          <RichInput
            label={STRINGS.FIELDS.ABOUT.LABEL}
            onChange={(value: string) => {
              setAbout(value);
            }}
            value={about}
            placeholder={STRINGS.FIELDS.ABOUT.PLACEHOLDER}
            options={[]}
          />
          </div>*/}
      </Box>
      {/*<h3>{STRINGS.SECTION_TITLE_2}</h3>
      <p>{STRINGS.SECTION_DESCRIPTION_2}</p>
      <Box>
        <RichInput
          key={adminFieldKey}
          label={STRINGS.FIELDS.ADMIN.LABEL}
          onChange={(value: string) => {
            setAdmin(value);
            updateErrors("admin", errors);
          }}
          value={admin}
          placeholder={STRINGS.FIELDS.ADMIN.PLACEHOLDER}
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
            {STRINGS.FIELDS.ADMIN_CHECKBOX.LABEL}
          </CheckboxLabel>
        </CheckboxWrapper>
          </Box>*/}
      <h3>{STRINGS.SECTION_TITLE_3}</h3>
      <p>{STRINGS.SECTION_DESCRIPTION_3}</p>
      <Box>
        <div style={{ marginBottom: "24px" }}>
          <RichInput
            label={STRINGS.FIELDS.ADMINS.LABEL}
            onChange={(value: string) => {
              setAdmins(value);
              updateErrors("admins[", errors, true);
            }}
            value={admins}
            placeholder={STRINGS.FIELDS.ADMINS.PLACEHOLDER}
            options={[]}
            tooltip={STRINGS.FIELDS.ADMINS.TOOLTIP}
            error={fieldError("admins[", errors, true)}
          />
        </div>
        <div>
          <RichInput
            label={STRINGS.FIELDS.MEMBERS.LABEL}
            onChange={(value: string) => {
              setMembers(value);
              updateErrors("members[", errors, true);
            }}
            value={members}
            placeholder={STRINGS.FIELDS.MEMBERS.PLACEHOLDER}
            options={[]}
            tooltip={STRINGS.FIELDS.MEMBERS.TOOLTIP}
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
        <Button
          onClick={handleSubmit}
          value={STRINGS.SUBMIT_BUTTON}
          fullWidth
        />
      </div>
    </Wrapper>
  );
};

export default WorkspaceCreatePage;
