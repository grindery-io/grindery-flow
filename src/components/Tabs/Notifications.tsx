import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS } from "../../constants";

const exampleNotifications = [
  {
    id: 1,
    icon: ICONS.WALLET,
    text: "Wallet balance low! Add funds",
  },
  {
    id: 2,
    icon: ICONS.WORKFLOWS,
    text: "Workflow Google Sheets - Moloch DAO Test Error",
  },
  {
    id: 3,
    icon: ICONS.WORKFLOWS,
    text: "Workflow Google Sheets - Moloch DAO Test Error",
  },
];

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
`;

const TextIconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Icon = styled.img`
  width: 20px;
  filter: invert(43%) sepia(36%) saturate(4084%) hue-rotate(332deg)
    brightness(115%) contrast(103%);
`;

type Props = {};

const Notifications = (props: Props) => {
  const [items, setitems] = useState(exampleNotifications);
  return (
    <Wrapper>
      {items.map((item) => (
        <DataBox
          key={item.id}
          size="small"
          LeftComponent={
            <TextIconWrapper>
              <Icon src={item.icon} alt="notifications icon" />
              <Text value={item.text} variant="body2" />
            </TextIconWrapper>
          }
        />
      ))}
    </Wrapper>
  );
};

export default Notifications;
