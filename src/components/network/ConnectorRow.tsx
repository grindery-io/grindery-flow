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
`;

const Column = styled.td`
  padding: 20px 10px;
`;

const Icon = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 8px;
  width: 40px;
  box-sizing: border-box;
  cursor: pointer;

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
  cursor: pointer;
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
    setAnchorEl(event.currentTarget);
  };
  return (
    <Row key={connector.id}>
      <Column style={{ width: "40px" }}>
        <Icon
          onClick={() => {
            navigate("/network/connector/" + connector.id);
          }}
        >
          <img src={connector.values?.icon || ""} alt="" />
        </Icon>
      </Column>
      <Column>
        <ConnectorName
          onClick={() => {
            navigate("/network/connector/" + connector.id);
          }}
        >
          {connector.values?.name || connector.id}
        </ConnectorName>
      </Column>
      <Column style={{ textAlign: "right" }}>
        {connector.values?.type || ""}
      </Column>
      <Column style={{ textAlign: "right" }}>
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
                alert("Operation not implemented yet");
              },
            },
            {
              key: "delete",
              label: "Delete",
              onClick: () => {
                alert("Operation not implemented yet");
              },
            },
          ]}
        />
      </Column>
    </Row>
  );
};

export default ConnectorRow;
