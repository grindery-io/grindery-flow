import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  CircularProgress,
  Dialog,
  Menu,
  Text,
  IconButton,
  RichInput,
} from "grindery-ui";
import DataBox from "./DataBox";
import {
  CDS_EDITOR_API_ENDPOINT,
  ICONS,
  isLocalOrStaging,
} from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import Button from "./Button";
import { useNavigate } from "react-router";
import { useGrinderyNexus } from "use-grindery-nexus";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";

const AppTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  color: var(--color-black);
`;

const AppIconWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
`;

const AppIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const AppCountersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const AppCounter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const AppCounterValue = styled.span`
  font-weight: 700;
  line-height: 1.25;
  font-size: 12px;
  display: block;
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

const DialogTitle = styled.h3`
  text-align: center;
  padding: 0;
  margin: 0 0 20px;
`;

const Error = styled.div`
  text-align: center;
  width: 100%;
  max-width: 350px;
  margin: 20px auto 30px;
  color: #ff5858;
  padding: 0;
`;

type Props = {
  item: any;
  showWorkflows?: boolean;
  showMenu?: boolean;
  onClick?: () => void;
};

const AppRow = (props: Props) => {
  const { client } = useAppContext();
  const { token } = useGrinderyNexus();
  const { workspaceToken } = useWorkspaceContext();
  const { item, showWorkflows, showMenu, onClick } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ type: "", text: "" });
  let navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloneClick = async () => {
    setDialogOpened(true);
  };

  const initClone = async () => {
    setError({ type: "", text: "" });
    if (!username) {
      setError({ type: "username", text: "Username is required" });
      return;
    }
    setLoading(true);
    let cds;
    try {
      cds = await client?.getDriver(
        item.key,
        isLocalOrStaging ? "staging" : undefined
      );
    } catch (err: any) {
      console.error("getDriver error", err);
      setError({
        type: "submit",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error",
      });
      setLoading(false);
      return;
    }

    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds/clone`,
        {
          cds: JSON.stringify(cds),
          username: username,
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("cloneCDS error", err);
      setError({
        type: "submit",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error",
      });
      setLoading(false);
      return;
    }
    if (res?.data?.key) {
      setDialogOpened(false);
      navigate(`/network/connector/${res?.data?.key}`);
    } else {
      setError({
        type: "submit",
        text: "Server error. Please, try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <DataBox
        onClick={onClick ? onClick : undefined}
        key={item.key}
        size="small"
        LeftComponent={
          <AppTitleWrapper>
            <AppIconWrapper>
              <AppIcon src={item.icon} alt={item.name} />
            </AppIconWrapper>
            <Title>{item.name}</Title>
          </AppTitleWrapper>
        }
        RightComponent={
          <>
            {showWorkflows && (
              <AppCountersWrapper>
                <AppCounter>
                  <AppCounterValue>{item.workflows.toString()}</AppCounterValue>
                  <span style={{ color: "#758796", height: "17px" }}>
                    <Text variant="caption" value="Workflows" />
                  </span>
                </AppCounter>
              </AppCountersWrapper>
            )}
            {showMenu && (
              <>
                <MenuButtonWrapper>
                  <IconButton
                    onClick={handleMenuOpen}
                    icon={ICONS.DOTS_HORIZONTAL}
                  />
                </MenuButtonWrapper>
                <Menu
                  anchorEl={anchorEl}
                  onClose={handleMenuClose}
                  closeOnClick
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  items={[
                    {
                      key: "clone",
                      label: "Clone",
                      onClick: handleCloneClick,
                    },
                  ]}
                />
              </>
            )}
          </>
        }
      />
      <Dialog
        open={dialogOpened}
        onClose={() => {
          setDialogOpened(false);
        }}
        maxWidth={"500px"}
      >
        <DialogTitle>Clone {item.name} connector</DialogTitle>
        <div style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}>
          <RichInput
            value={username}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setUsername(value);
            }}
            label="GitHub Username"
            placeholder="Enter your GitHub Username"
            options={[]}
            singleLine
            required
            tooltip="Your GitHub profile will be referenced as a creator of the connector."
            error={error.type === "username" ? error.text : ""}
          />
        </div>
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: "#8C30F5",
              margin: "20px",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        )}
        {error.type === "submit" && <Error>{error.text}</Error>}
        <Button
          disabled={loading}
          loading={loading}
          value="Clone"
          onClick={initClone}
        />
      </Dialog>
    </>
  );
};

export default AppRow;
