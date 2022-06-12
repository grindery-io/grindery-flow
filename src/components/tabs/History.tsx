import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { InputBox } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS } from "../../constants";

const exampleLogs = [
  {
    status: "Executed",
    apps: [
      {
        name: "Google Sheets",
        icon: "/images/examples/googlesheets.svg",
      },
      {
        name: "MolochDAO",
        icon: "/images/examples/molochdao.svg",
      },
    ],
    timestamp: 1654616303000,
  },
  {
    status: "Executed",
    apps: [
      {
        name: "Google Calendar",
        icon: "/images/examples/googlecalendar.svg",
      },
      {
        name: "MolochDAO",
        icon: "/images/examples/molochdao.svg",
      },
    ],
    timestamp: 1654616303000,
  },
  {
    status: "Executed",
    apps: [
      {
        name: "Google Forms",
        icon: "/images/examples/googleforms.svg",
      },
      {
        name: "MolochDAO",
        icon: "/images/examples/molochdao.svg",
      },
    ],
    timestamp: 1654616303000,
  },
  {
    status: "Error",
    apps: [
      {
        name: "Google Forms",
        icon: "/images/examples/googleforms.svg",
      },
      {
        name: "MolochDAO",
        icon: "/images/examples/molochdao.svg",
      },
    ],
    timestamp: 1654616303000,
  },
  {
    status: "Error",
    apps: [
      {
        name: "Google Forms",
        icon: "/images/examples/googleforms.svg",
      },
      {
        name: "MolochDAO",
        icon: "/images/examples/molochdao.svg",
      },
    ],
    timestamp: 1654616303000,
  },
];

const statusIconMapping: { [key: string]: string } = {
  Executed: ICONS.EXECUTED,
  Error: ICONS.ERROR,
};

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
  gap: 4px;
  min-width: 70px;
`;

const ItemIcon = styled.img`
  width: 12px;
  height: 12px;
  display: block;
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

const ItemDate = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 150%;
  color: #758796;
`;

type Props = {};

const History = (props: Props) => {
  const [items, setItems] = useState(exampleLogs);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.apps.filter((app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).length > 0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchInputWrapper>
          <InputBox
            placeholder={"History"}
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
          />
        </SearchInputWrapper>
      </SearchWrapper>
      <ItemsWrapper>
        {filteredItems.map((item, i) => (
          <DataBox
            key={item.timestamp + i}
            size="small"
            LeftComponent={
              <ItemTitleWrapper>
                <ItemIcon
                  src={statusIconMapping[item.status]}
                  alt={item.status}
                />
                <Title>{item.status}</Title>
              </ItemTitleWrapper>
            }
            CenterComponent={
              <ItemAppsWrapper>
                {item.apps.map((app, i2) => (
                  <ItemAppWrapper key={item.timestamp + i + i2}>
                    <ItemAppIcon src={app.icon} alt={app.name} />
                  </ItemAppWrapper>
                ))}
              </ItemAppsWrapper>
            }
            RightComponent={
              <ItemDate>
                {moment(item.timestamp).format("MMM DD, YYYY HH:mm:ss")}
              </ItemDate>
            }
          />
        ))}
      </ItemsWrapper>
    </Wrapper>
  );
};

export default History;
