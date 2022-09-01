import React, { useState } from "react";
import styled from "styled-components";
import Jdenticon from "react-jdenticon";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import useAppContext from "../../hooks/useAppContext";
import { Workspace } from "../../context/WorkspaceContext";
import { ICONS, isLocalOrStaging } from "../../constants";
import Foco from "react-foco";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  position: relative;
`;

const Selector = styled.button`
  font-family: Roboto;
  background: none;
  box-shadow: none;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #eee0fd;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;

  &:hover,
  &.opened {
    border-color: #0b0d17 !important;
  }
`;
const Text = styled.div`
  text-align: left;
`;

const Name = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 103%;
  color: #0b0d17;
  margin: 0 0 2px;
  max-width: 160px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Role = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 100%;
  color: #979797;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const Dropdown = styled.div`
  font-family: Roboto;
  position: absolute;
  left: 0;
  top: 100%;
  padding-top: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  transform: translateY(-10px);

  &.opened {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }
`;

const DropdownContent = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 10px;
  max-height: 400px;
  overflow: auto;
`;

const DropdownItem = styled.div`
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  border-radius: 5px;
  border: none;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  max-width: 220px;

  .avatar {
    background: #f4f5f7;
    padding: 2px;
    border-radius: 50%;
    box-sizing: border-box;
    width: 20px;
    height: 20px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover {
    background: #fdfbff;
  }

  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
    white-space: nowrap;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & .edit-item {
    margin-left: auto;
    opacity: 0;
    visibility: hidden;
    width: 16px;
    height: 16px;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover .edit-item {
    opacity: 1;
    visibility: visible;
  }
`;

type Props = {};

const getUserRole = (workspace: Workspace | null, user: string) => {
  if (workspace?.admin === user) {
    return "admin";
  }
  if (workspace?.admins.includes(user)) {
    return "admin";
  }
  if (workspace?.members.includes(user)) {
    return "member";
  }
  return "";
};

const WorkspaceSelector = (props: Props) => {
  const { user } = useAppContext();
  const { workspace, workspaces, setWorkspace } = useWorkspaceContext();
  const [selectorOpened, setSelectorOpened] = useState(false);
  let navigate = useNavigate();

  const name = workspace?.name;
  const role = getUserRole(workspace, user);

  const items = workspaces;

  const handleSelectorClick = () => {
    setSelectorOpened(!selectorOpened);
  };

  const handleCreateClick = () => {
    navigate("workspaces/new");
    setSelectorOpened(false);
  };

  if (isLocalOrStaging) {
    console.log("workspace", workspace);
    console.log("workspaces", workspaces);
  }

  return workspace ? (
    <Foco
      onClickOutside={() => {
        setSelectorOpened(false);
      }}
      onFocusOutside={() => {
        setSelectorOpened(false);
      }}
    >
      <Container>
        <Selector
          onClick={handleSelectorClick}
          className={selectorOpened ? "opened" : ""}
        >
          <Text>
            <Name>{name}</Name>
            <Role>{role}</Role>
          </Text>
          <Icon src={ICONS.CARET_DOWN} alt="" />
        </Selector>
        <Dropdown className={selectorOpened ? "opened" : ""}>
          <DropdownContent>
            {items.map((item: any) => (
              <DropdownItem
                onClick={() => {
                  setWorkspace(item);
                }}
                key={item.id}
              >
                <div className="avatar">
                  <Jdenticon size="16" value={encodeURIComponent(item.name)} />
                </div>
                <span>{item.name || ""}</span>
                <img
                  className="edit-item"
                  src={ICONS.EDIT}
                  alt=""
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </DropdownItem>
            ))}
            <DropdownItem onClick={handleCreateClick}>
              <img src={ICONS.PLUS_BLACK} alt="" />
              <span>Create Workspace</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </Container>
    </Foco>
  ) : null;
};

export default WorkspaceSelector;
