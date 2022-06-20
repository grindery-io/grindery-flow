import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Text, InputBox } from "grindery-ui";
import DataBox from "../shared/DataBox";
import apps from "../../samples/apps";
import { ICONS, SCREEN } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;

  @media (min-width: ${SCREEN.DESKTOP}) {
    padding: 60px 106px;
    margin: 107px 20px 0;
    border: 1px solid #dcdcdc;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 5px;

  .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }

  @media (min-width: ${SCREEN.DESKTOP}) {
    .MuiIconButton-root {
      margin-left: auto;
    }
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;

  & .MuiBox-root {
    margin-bottom: 0;
  }
  & .MuiOutlinedInput-root {
    margin-top: 0;
  }

  @media (min-width: ${SCREEN.DESKTOP}) {
    flex: 0.5;
  }
`;

const AppsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const AppTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
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
  display: block;
`;

type Props = {};

const Apps = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [items, setItems] = useState(apps);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchInputWrapper>
          <InputBox
            placeholder={"(d)Apps"}
            value={searchTerm}
            onChange={handleSearchChange}
            type="search"
            icon="search"
          />
        </SearchInputWrapper>
        <IconButton icon={ICONS.PLUS} color="" />
      </SearchWrapper>
      <AppsWrapper>
        {filteredItems.map((item) => (
          <DataBox
            key={item.name}
            size="small"
            LeftComponent={
              <AppTitleWrapper>
                <AppIconWrapper>
                  <AppIcon src={item.icon} alt={item.name} />
                </AppIconWrapper>
                <Text variant="body2" value={item.name} />
              </AppTitleWrapper>
            }
            RightComponent={
              <AppCountersWrapper>
                <AppCounter>
                  <AppCounterValue>{item.workflows.toString()}</AppCounterValue>
                  <span style={{ color: "#758796", height: "17px" }}>
                    <Text variant="caption" value="Workflows" />
                  </span>
                </AppCounter>
              </AppCountersWrapper>
            }
          />
        ))}
      </AppsWrapper>
    </Wrapper>
  );
};

export default Apps;
