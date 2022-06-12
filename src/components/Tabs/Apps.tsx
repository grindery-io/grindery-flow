import React, { useState } from "react";
import styled from "styled-components";
import { Text, InputBox } from "grindery-ui";
import DataBox from "../shared/DataBox";

const exampleApps = [
  {
    name: "Google Sheets",
    icon: "/images/examples/googlesheets.svg",
    connections: 1,
    workflows: 2,
  },
  {
    name: "Google Calendar",
    icon: "/images/examples/googlecalendar.svg",
    connections: 1,
    workflows: 1,
  },
  {
    name: "Google Forms",
    icon: "/images/examples/googleforms.svg",
    connections: 1,
    workflows: 2,
  },
];

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 0px;
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
  const [items, setItems] = useState(exampleApps);
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
          />
        </SearchInputWrapper>
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
                  <Text
                    variant="caption"
                    value={
                      <AppCounterValue>
                        {item.connections.toString()}
                      </AppCounterValue>
                    }
                  />
                  <span style={{ color: "#758796", height: "17px" }}>
                    <Text variant="caption" value="Connection" />
                  </span>
                </AppCounter>
                <AppCounter>
                  <Text
                    variant="caption"
                    value={
                      <AppCounterValue>
                        {item.workflows.toString()}
                      </AppCounterValue>
                    }
                  />
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
