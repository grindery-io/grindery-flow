import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, IconButton } from "grindery-ui";
import styled from "styled-components";
import { ICONS } from "../../constants";

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

  cursor: pointer;

  &:last-child {
    cursor: default;
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

type Props = {
  connector: any;
};

const ConnectorRow = (props: Props) => {
  const { connector } = props;
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  return (
    <Row key={connector.id}>
      <Column
        style={{ width: "40px" }}
        onClick={() => {
          navigate("/network/connector/" + connector.id);
        }}
      >
        <Icon>
          <img src={connector.values?.icon || ICONS.NEXUS_SQUARE} alt="" />
        </Icon>
      </Column>
      <Column
        onClick={() => {
          navigate("/network/connector/" + connector.id);
        }}
      >
        <ConnectorName>{connector.values?.name || connector.id}</ConnectorName>
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + connector.id);
        }}
      >
        {connector.values?.type || ""}
      </Column>
      <Column
        style={{ textAlign: "right" }}
        onClick={() => {
          navigate("/network/connector/" + connector.id);
        }}
      >
        {connector.values?.status?.name || ""}
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
          items={[
            {
              key: "edit",
              label: "Edit",
              onClick: () => {
                navigate("/network/connector/" + connector.id);
              },
            },
            {
              key: "clone",
              label: "Clone",
              onClick: () => {
                alert("Work in progress");
              },
            },
            {
              key: "delete",
              label: "Delete",
              onClick: () => {
                alert("Work in progress");
              },
            },
          ]}
        />
      </Column>
    </Row>
  );
};

export default ConnectorRow;
