import React, { useState } from "react";
import _ from "lodash";
import styled from "styled-components";
import moment from "moment";
import { Button, DialogBox, InputBox } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS } from "../../constants";

type Transaction = {
  id: string | number;
  type: string;
  name: string;
  amount: number;
  token: string;
  usd: number;
  timestamp: number;
  title?: string;
  details?: string;
  comment?: string;
};

const exampleTransactions = [
  {
    id: 1,
    type: "deposit",
    name: "0xB8c77...bDD52",
    amount: 0.036,
    token: "ETH",
    usd: 100,
    timestamp: 1628696303000,
    title: "Inboundlabs",
    details:
      "Transaction details. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 0005582EUR\nCustomer reference: NSCT2108060007920000000000001",
    comment:
      "This is a comment the sender. in this case Inboundlabs, has made.",
  },
  {
    id: 2,
    type: "gas",
    name: "Gnosis Chain",
    amount: 0.0072,
    token: "ETH",
    usd: 20,
    timestamp: 1628609903000,
    title: "Inboundlabs",
    details:
      "Transaction details. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 0005582EUR\nCustomer reference: NSCT2108060007920000000000001",
    comment:
      "This is a comment the sender. in this case Inboundlabs, has made.",
  },
  {
    id: 3,
    type: "service",
    name: "Sendgrid",
    amount: 0.0036,
    token: "ETH",
    usd: 10,
    timestamp: 1628609903000,
    title: "Inboundlabs",
    details:
      "Transaction details. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 0005582EUR\nCustomer reference: NSCT2108060007920000000000001",
    comment:
      "This is a comment the sender. in this case Inboundlabs, has made.",
  },
  {
    id: 4,
    type: "fees",
    name: "Grindery",
    amount: 0.0036,
    token: "ETH",
    usd: 10,
    timestamp: 1628609903000,
    title: "Inboundlabs",
    details:
      "Transaction details. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 0005582EUR\nCustomer reference: NSCT2108060007920000000000001",
    comment:
      "This is a comment the sender. in this case Inboundlabs, has made.",
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

const DialogTitle = styled.h3`
  font-weight: 700;
  font-size: 25px;
  line-height: 130%;
  padding: 0;
  margin: 0 0 20px;
`;

const DialogSubtitleWrapper = styled.div`
  margin: 0 0 20px;
`;

const DialogSubtitle = styled.h4`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  padding: 0;
  margin: 0;
`;

const DialogAddress = styled.h5`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  padding: 0;
  margin: 4px 0 0;
`;

const DialogDetails = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  padding: 0;
  margin: 0 0 20px;
`;

const DialogComment = styled.div`
  background: #f4f5f7;
  border-radius: 8px;
  padding: 10px;
  margin: 0 0 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const DialogCommentIcon = styled.img`
  width: 16px;
  min-width: 16px;
  height: 24px;
  margin-right: 10px;
`;

const DialogCommentText = styled.p`
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #898989;
  padding: 0;
  margin: 0;
`;

const DialogDateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
`;

const DialogDateLabel = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;
  padding: 0;
  margin: 0;
`;

const DialogDate = styled.p`
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  padding: 0;
  margin: 0 0 0 auto;
`;

const DialogAmount = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  opacity: 0.5;
  padding: 0;
  text-align: right;
  margin: 0 0 20px;
`;

type Props = {};

const Transactions = (props: Props) => {
  const [items, setItems] = useState<Transaction[]>(exampleTransactions);
  const [dialog, setDialog] = useState<null | string | number>(null);
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
              {orderedGroups[key].map((item: Transaction) => (
                <>
                  <DataBox
                    onClick={() => {
                      setDialog(item.id);
                    }}
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
                  <DialogBox
                    open={dialog === item.id}
                    onClose={() => {
                      setDialog(null);
                    }}
                  >
                    {item.title && (
                      <DialogTitle>
                        {item.type !== "deposit" ? "- " : ""}${item.usd}
                      </DialogTitle>
                    )}
                    <DialogSubtitleWrapper>
                      <DialogSubtitle>{item.title}</DialogSubtitle>
                      <DialogAddress>{item.name}</DialogAddress>
                    </DialogSubtitleWrapper>
                    {item.details && (
                      <DialogDetails>{item.details}</DialogDetails>
                    )}
                    {item.comment && (
                      <DialogComment>
                        <DialogCommentIcon
                          src={ICONS.COMMENT}
                          alt="comment icon"
                        />
                        <DialogCommentText>{item.comment}</DialogCommentText>
                      </DialogComment>
                    )}
                    <DialogDateWrapper>
                      <DialogDateLabel>Date</DialogDateLabel>
                      <DialogDate>
                        {moment(item.timestamp).format("DD MMMM YYYY")}
                      </DialogDate>
                    </DialogDateWrapper>
                    <DialogAmount>
                      {item.type !== "deposit" ? "- " : ""}
                      {item.amount} {item.token}
                    </DialogAmount>
                    <Button
                      variant="outlined"
                      value="Close"
                      onClick={() => {
                        setDialog(null);
                      }}
                    />
                  </DialogBox>
                </>
              ))}
            </ItemsWrapper>
          </div>
        ))}
      </GroupsWrapper>
    </Wrapper>
  );
};

export default Transactions;
