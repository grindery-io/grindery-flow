import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Menu } from "grindery-ui";
import { ICONS } from "../../constants";
import { useNavigate, useParams } from "react-router";

const Row = styled.tr`
  border-bottom: 1px solid #dcdcdc;
  border-top: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 10px;
  }
  & > td:last-child {
    padding-right: 10px;
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

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  operation: any;
};

const OperationRow = (props: Props) => {
  const { operation } = props;
  let { id, type } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Row>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${operation.key}/settings`
          );
        }}
      >
        {operation.display?.label || operation.name || operation.key || ""}
      </Column>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${operation.key}/settings`
          );
        }}
      >
        {operation.key || ""}
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
              key: "1",
              label: "Edit",
              onClick: () => {
                navigate(
                  `/network/connector/${id}/${type}/${operation.key}/settings`
                );
              },
            },
            {
              key: "2",
              label: "Delete",
              onClick: () => {
                alert("Not implemented yet");
              },
            },
          ]}
        />
      </Column>
    </Row>
  );
};

export default OperationRow;
