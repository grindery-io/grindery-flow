import React, { useState } from "react";
import styled from "styled-components";
import { InputBox, SwitchInput } from "grindery-ui";
import WorkflowConstructor from "../workflow/WorkflowConstructor";
import workflows from "../../samples/workflows";
import DataBox from "../shared/DataBox";
import { useAppContext } from "../../context/AppContext";
import { ICONS } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 5px;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: #0b0d17;
`;

const ItemAppsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
`;

const ItemAppWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const ItemAppIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const ItemActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const IconButton = styled.div`
  padding: 4px;
  cursor: pointer;
  & img {
    display: block;
  }
`;

type Props = {};

const Workflows = (props: Props) => {
  const [isNew, setIsNew] = useState(false);
  const [items, setItems] = useState(workflows);
  const [searchTerm, setSearchTerm] = useState("");
  const { connectors } = useAppContext();

  const filteredItems = searchTerm
    ? items.filter(
        (item) =>
          item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return !isNew ? (
    <Wrapper>
      <SearchWrapper>
        <SearchInputWrapper>
          <InputBox
            placeholder={"Workflows"}
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
          />
        </SearchInputWrapper>
        <IconButton
          onClick={() => {
            setIsNew(true);
          }}
        >
          <img src={ICONS.PLUS} alt="add workflow" />
        </IconButton>
      </SearchWrapper>
      <ItemsWrapper>
        {filteredItems.map((item, i) => (
          <DataBox
            key={item.id}
            size="small"
            LeftComponent={
              <ItemTitleWrapper>
                <ItemAppsWrapper>
                  <ItemAppWrapper>
                    <ItemAppIcon
                      src={
                        connectors?.find(
                          (c) => c.key === item.trigger.connector
                        )?.icon
                      }
                      alt="app icon"
                    />
                  </ItemAppWrapper>
                  {item.actions.map((action, i2) => (
                    <ItemAppWrapper key={item.id + action.connector + i2}>
                      <ItemAppIcon
                        src={
                          connectors?.find((c) => c.key === action.connector)
                            ?.icon
                        }
                        alt="app icon"
                      />
                    </ItemAppWrapper>
                  ))}
                </ItemAppsWrapper>
                <Title>{item.title}</Title>
              </ItemTitleWrapper>
            }
            RightComponent={
              <ItemActionsWrapper>
                <SwitchInput
                  value={item.enabled}
                  onChange={() => {
                    setItems([
                      ...items.map((itm) =>
                        itm.id === item.id
                          ? { ...itm, enabled: item.enabled ? false : true }
                          : itm
                      ),
                    ]);
                  }}
                />
              </ItemActionsWrapper>
            }
          />
        ))}
      </ItemsWrapper>
    </Wrapper>
  ) : (
    <WorkflowConstructor setIsNew={setIsNew} />
  );
};

export default Workflows;
