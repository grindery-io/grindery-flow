import React, { useState } from "react";
import _ from "lodash";
import styled from "styled-components";
import moment from "moment";
import { InputBox } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS } from "../../constants";

const exampleTransactions = [
  {
    id: 1,
    type: "deposit",
    name: "0xB8c77...bDD52",
    amount: 0.036,
    token: "ETH",
    usd: 100,
    timestamp: 1628696303000,
  },
  {
    id: 2,
    type: "gas",
    name: "Gnosis Chain",
    amount: 0.0072,
    token: "ETH",
    usd: 20,
    timestamp: 1628609903000,
  },
  {
    id: 3,
    type: "service",
    name: "Sendgrid",
    amount: 0.0036,
    token: "ETH",
    usd: 10,
    timestamp: 1628609903000,
  },
  {
    id: 4,
    type: "fees",
    name: "Grindery",
    amount: 0.0036,
    token: "ETH",
    usd: 10,
    timestamp: 1628609903000,
  },
];

const typeIconMapping: { [key: string]: string } = {
  deposit: ICONS.DEPOSIT,
  gas: ICONS.GAS,
  service: ICONS.SERVICE,
  fees: ICONS.FEES,
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

const GroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
`;

const GroupTitleWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const GroupTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  opacity: 0.5;
`;

const GroupSummaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 6px;
`;

const GroupSummaryUsd = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: #898989;
`;

const GroupSummarySeparator = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
`;

const GroupSummaryToken = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 150%;
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

const ItemIcon = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;

const Title = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
`;

const ItemNumbers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const ItemTokens = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
`;

const ItemUSD = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: #898989;
`;

type Props = {};

const Transactions = (props: Props) => {
  const [items, setItems] = useState(exampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // convert real timestamps to day timestamps
  const itemsWithDates = filteredItems.map((item) => ({
    ...item,
    date: moment(moment(item.timestamp).format("DD MMMM YYYY"), "DD MMMM YYYY")
      .format("x")
      .toString(),
  }));

  // group items by day timestamp
  const groupedItems = _.groupBy(itemsWithDates, "date");

  // sort groups by day
  const orderedGroups = Object.keys(groupedItems)
    .sort()
    .reverse()
    .reduce((obj: any, key: string) => {
      obj[key] = groupedItems[key];
      return obj;
    }, {});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchInputWrapper>
          <InputBox
            placeholder={"Transactions"}
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
          />
        </SearchInputWrapper>
      </SearchWrapper>
      <GroupsWrapper>
        {Object.keys(orderedGroups).map((key) => (
          <div>
            <GroupTitleWrapper>
              <GroupTitle>
                {moment(parseInt(key)).format("DD MMMM YYYY")}
              </GroupTitle>
              <GroupSummaryWrapper>
                <GroupSummaryUsd>
                  {orderedGroups[key]
                    .map((item: { usd: number; type: string }) =>
                      item.type !== "deposit" ? item.usd * -1 : item.usd
                    )
                    .reduce((acc: number, val: number) => acc + val, 0) < 0
                    ? "- "
                    : ""}
                  $
                  {orderedGroups[key]
                    .map((item: { usd: number }) => item.usd)
                    .reduce((acc: number, val: number) => acc + val, 0)}
                </GroupSummaryUsd>
                <GroupSummarySeparator>|</GroupSummarySeparator>
                <GroupSummaryToken>
                  {orderedGroups[key]
                    .map((item: { amount: number; type: string }) =>
                      item.type !== "deposit" ? item.amount * -1 : item.amount
                    )
                    .reduce((acc: number, val: number) => acc + val, 0) < 0
                    ? "- "
                    : ""}
                  {orderedGroups[key]
                    .map(
                      (item: { amount: number; type: string }) => item.amount
                    )
                    .reduce((acc: number, val: number) => acc + val, 0)}
                  {" ETH"}
                </GroupSummaryToken>
              </GroupSummaryWrapper>
            </GroupTitleWrapper>
            <ItemsWrapper>
              {orderedGroups[key].map(
                (item: {
                  id: string | number;
                  type: string;
                  name: string;
                  token: string;
                  amount: number;
                  usd: number;
                }) => (
                  <DataBox
                    key={item.id}
                    size="small"
                    LeftComponent={
                      <ItemTitleWrapper>
                        <ItemIcon
                          src={typeIconMapping[item.type]}
                          alt={item.type}
                        />
                        <Title>{item.name}</Title>
                      </ItemTitleWrapper>
                    }
                    RightComponent={
                      <ItemNumbers>
                        <ItemTokens>
                          {item.amount} {item.token}
                        </ItemTokens>
                        <ItemUSD>
                          {item.type !== "deposit" ? "- " : ""}${item.usd}
                        </ItemUSD>
                      </ItemNumbers>
                    }
                  />
                )
              )}
            </ItemsWrapper>
          </div>
        ))}
      </GroupsWrapper>
    </Wrapper>
  );
};

export default Transactions;
