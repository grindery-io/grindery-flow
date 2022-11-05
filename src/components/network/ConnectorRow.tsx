import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  CircularProgress,
  RichInput,
  Dialog,
  Menu,
  IconButton,
} from "grindery-ui";
import styled from "styled-components";
import {
  CDS_EDITOR_API_ENDPOINT,
  ICONS,
  isLocalOrStaging,
} from "../../constants";
import ConnectorContributor from "./ConnectorContributor";
import useAppContext from "../../hooks/useAppContext";
import axios from "axios";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useGrinderyNexus } from "use-grindery-nexus";
import Button from "./Button";

const Row = styled.tr`
  border: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 20px;
  }
  & > td:last-child {
    padding-right: 20px;
    text-align: right;
  }

  &:hover {
    background: #f7f7f7;
  }
`;

const Column = styled.td`
  padding: 20px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
  cursor: pointer;

  &:first-child {
    max-width: 30px;
  }

  &:last-child {
    cursor: default;
    max-width: 30px;
  }
`;

const Icon = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 8px;
  width: 40px;
  box-sizing: border-box;

  & img {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const ConnectorName = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  color: #141416;
  padding: 0;
  margin: 0;
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
  connector: any;
};

const ConnectorRow = (props: Props) => {
  const { connector } = props;
  const { client } = useAppContext();
  const { workspaceToken } = useWorkspaceContext();
  const { token } = useGrinderyNexus();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const cds = JSON.parse(connector?.values?.cds || "");
  const [dialogOpened, setDialogOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ type: "", text: "" });

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
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
    let driver;
    try {
      driver = await client?.getDriver(
        cds?.key,
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

  const menuItems = [
    {
      key: "edit",
      label: "Edit",
      onClick: () => {
        navigate("/network/connector/" + cds.key);
      },
    },
    {
      key: "clone",
      label: "Clone",
      onClick: handleCloneClick,
    },
  ];

  if (connector?.values?.status?.name !== "Published") {
    menuItems.push({
      key: "delete",
      label: "Delete",
      onClick: () => {
        alert("Not implemented yet");
      },
    });
  }

  return (
    <Row key={cds.key}>
      <Column
        style={{ width: "40px" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        <Icon>
          <img src={cds?.icon || ICONS.NEXUS_SQUARE} alt="" />
        </Icon>
      </Column>
      <Column
        style={{ width: "30%" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        <ConnectorName>{cds?.name || cds.key}</ConnectorName>
      </Column>
      <Column style={{ textAlign: "right" }}>
        <ConnectorContributor contributor={connector.values?.contributor} />
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        {cds?.access || "Public"}
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + cds.key);
        }}
      >
        {connector.values?.status?.name === "Approved"
          ? "Published"
          : connector.values?.status?.name || ""}
      </Column>
      <Column style={{ textAlign: "right", width: "30px" }}>
        <MenuButtonWrapper>
          <IconButton onClick={handleMenuOpen} icon={ICONS.DOTS_HORIZONTAL} />
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
          items={menuItems}
        />
        <Dialog
          open={dialogOpened}
          onClose={() => {
            setDialogOpened(false);
          }}
          maxWidth={"500px"}
        >
          <DialogTitle>Clone {cds?.name} connector</DialogTitle>
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
                color: "#ffb930",
                width: "100%",
                margin: "20px 0 30px",
              }}
            >
              <CircularProgress color="inherit" />
            </div>
          )}
          {error.type === "submit" && <Error>{error.text}</Error>}
          <div style={{ textAlign: "center" }}>
            <Button disabled={loading} onClick={initClone}>
              Clone
            </Button>
          </div>
        </Dialog>
      </Column>
    </Row>
  );
};

export default ConnectorRow;
