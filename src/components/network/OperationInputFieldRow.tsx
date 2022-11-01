import React, { useState } from "react";
import _ from "lodash";
import styled from "styled-components";
import { IconButton, Menu } from "grindery-ui";
import { ICONS } from "../../constants";
import useConnectorContext from "../../hooks/useConnectorContext";
import { Navigate, useNavigate, useParams } from "react-router";

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
  inputKey: string;
  type: string | undefined;
  onDelete: (a: string) => void;
};

const OperationInputFieldRow = (props: Props) => {
  const { inputKey, onDelete } = props;
  const { id, type, key } = useParams();
  const { state } = useConnectorContext();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputField: any =
    (type &&
      state.cds?.[type]
        ?.find((op: any) => op.key === key)
        ?.operation?.inputFields?.find(
          (field: any) => field?.key === inputKey
        )) ||
    null;

  console.log("inputField", inputField);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return inputField ? (
    <Row>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${key}/inputFields/${inputField.key}`
          );
        }}
      >
        {inputField.label || inputField.key || ""}
      </Column>
      <Column
        onClick={() => {
          navigate(
            `/network/connector/${id}/${type}/${key}/inputFields/${inputField.key}`
          );
        }}
      >
        {inputField.key || ""}
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
                navigate(
                  `/network/connector/${id}/${type}/${key}/inputFields/${inputField.key}`
                );
              },
            },
            {
              key: "delete",
              label: "Delete",
              onClick: () => {
                onDelete(inputField.key);
              },
            },
          ]}
        />
      </Column>
    </Row>
  ) : null;
};

export default OperationInputFieldRow;
