import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RichInput, Alert } from "grindery-ui";
import Jdenticon from "react-jdenticon";
import useAppContext from "../../hooks/useAppContext";
import Button from "../shared/Button";
import { getValidationScheme } from "../../helpers/utils";
import { ICONS } from "../../constants";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router-dom";

const STRINGS = {
  TITLE: "Manage Workspace",
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
  SECTION_TITLE_2: "Moderation",
  SECTION_DESCRIPTION_2: "Who can manage this Workspace and create Workflows?",
  SUBMIT_BUTTON: "Save Workspace",
  DELETE_BUTTON: "Delete Workspace",
  LEAVE_BUTTON: "Leave Workspace",
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

    & p {
      opacity: 0.5 !important;
    }
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

const ButtonWrapper = styled.div`
  margin-top: 14px;
  & .MuiButton-root {
    &:hover {
      box-shadow: none;
    }
  }
`;

const DeleteButtonWrapper = styled.div`
  & .MuiButton-root {
    background-color: #ff5858;

    &:hover {
      background-color: #ff5858;
      box-shadow: none;
    }
  }
`;

const AlertWrapper = styled.div`
  margin-top: 24px;
`;

type Props = {};

const WorkspaceEditPage = (props: Props) => {
  const { user, validator, access_token } = useAppContext();
  const {
    workspaces,
    setWorkspaces,
    setWorkspace,
    workspace,
    isLoaded,
    deleteWorkspace,
    updateWorkspace,
  } = useWorkspaceContext();
  const id = workspace;
  const [currentWorkspace, setCurrentWorkspace] = useState(
    workspaces.find((ws) => ws.key === id) || workspaces[0]
  );
  const isMember = currentWorkspace?.members?.includes(user);
  const isAdmin =
    currentWorkspace?.admins?.includes(user) ||
    currentWorkspace?.creator === user;
  const isPersonal = id === "personal";
  const [title, setTitle] = useState(currentWorkspace?.title || "");
  const [key, setKey] = useState(id);
  const [about, setAbout] = useState(currentWorkspace?.about || "");
  const [admins, setAdmins] = useState(
    (currentWorkspace?.admins?.join("\n") || "").replace(
      new RegExp("eip155:1:", "g"),
      ""
    ) || ""
  );
  const [members, setMembers] = useState(
    (currentWorkspace?.members?.join("\n") || "").replace(
      new RegExp("eip155:1:", "g"),
      ""
    ) || ""
  );
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  //const admin = currentWorkspace?.creator;
  //const id = workspace?.id || encodeURIComponent(workspace?.name || "id");
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
      // all good

      setErrors(false);
      setFormError("");
      const res = await updateWorkspace(
        user,
        {
          key: id,
          title,
        },
        access_token || ""
      ).catch((err) => {
        setFormError("Network error. Please try again later.");
      });
      if (!res) {
        setFormError("Network error. Please try again later.");
      }
    } else {
      setErrors(validated);
      setFormError("Please complete all required fields.");
    }
  };

  const handleDelete = async () => {
    setFormError("");
    if (
      window.confirm(
        "Are you sure you want to delete the workspace?\nAll workflows associated with this workspace will be disabled and you won't be able to restore them."
      )
    ) {
      //const newWorkspaces = [...workspaces.filter((ws) => ws.key !== id)];
      //setWorkspaces(newWorkspaces);
      const res = await deleteWorkspace(
        user,
        currentWorkspace.key,
        access_token || ""
      ).catch((err) => {
        setFormError(err.message);
      });
      if (res) {
        setWorkspace("personal");
        navigate("/");
      } else {
        setFormError("Network error. Please try again later.");
      }
    }
  };

  const handleLeave = () => {
    if (
      window.confirm(
        "Are you sure you want to leave the workspace?\nYou will lose access to all workflows associated with this workspace."
      )
    ) {
      const newWorkspaces = [...workspaces.filter((ws) => ws.key !== id)];
      setWorkspaces(newWorkspaces);
      setWorkspace(newWorkspaces[0].key);
      navigate("/");
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

  useEffect(() => {
    if (id) {
      const newCurrentWorkspace =
        workspaces.find((ws) => ws.key === id) || workspaces[0];
      setCurrentWorkspace(newCurrentWorkspace);
      setTitle(newCurrentWorkspace?.title || "");
      setAbout(newCurrentWorkspace?.about || "");
      setAdmins(
        (newCurrentWorkspace?.admins?.join("\n") || "").replace(
          new RegExp("eip155:1:", "g"),
          ""
        ) || ""
      );
      setMembers(
        (newCurrentWorkspace?.members?.join("\n") || "").replace(
          new RegExp("eip155:1:", "g"),
          ""
        ) || ""
      );
      setFormError("");
      setErrors(false);
      setKey(id);
    }
  }, [id, workspaces]);

  return isLoaded && id ? (
    <Wrapper>
      <h1>{STRINGS.TITLE}</h1>
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
            key={key + "title"}
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
            readonly={isPersonal || (isMember && !isAdmin)}
          />
        </div>
        {/*<div>
          <RichInput
            key={key + "about"}
            label={STRINGS.FIELDS.ABOUT.LABEL}
            onChange={(value: string) => {
              setAbout(value);
            }}
            value={about}
            placeholder={STRINGS.FIELDS.ABOUT.PLACEHOLDER}
            options={[]}
            readonly={isMember && !isAdmin}
          />
          </div>*/}
      </Box>
      {isAdmin && !isPersonal && (
        <>
          <h3>{STRINGS.SECTION_TITLE_2}</h3>
          <p>{STRINGS.SECTION_DESCRIPTION_2}</p>
          <Box>
            <div style={{ marginBottom: "24px" }}>
              <RichInput
                key={key + "admin"}
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
                key={key + "members"}
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
        </>
      )}
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
      {isAdmin && !isPersonal && (
        <>
          <ButtonWrapper>
            <Button
              onClick={handleSubmit}
              value={STRINGS.SUBMIT_BUTTON}
              fullWidth
            />
          </ButtonWrapper>
          {!isPersonal && (
            <DeleteButtonWrapper>
              <Button
                onClick={handleDelete}
                value={STRINGS.DELETE_BUTTON}
                fullWidth
                color="error"
              />
            </DeleteButtonWrapper>
          )}
        </>
      )}
      {isMember && (
        <DeleteButtonWrapper style={{ marginTop: "14px" }}>
          <Button
            onClick={handleLeave}
            value={STRINGS.LEAVE_BUTTON}
            fullWidth
            color="error"
          />
        </DeleteButtonWrapper>
      )}
    </Wrapper>
  ) : null;
};

export default WorkspaceEditPage;
