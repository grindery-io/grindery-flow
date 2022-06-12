import React from "react";
import styled from "styled-components";
import { Text } from "grindery-ui";
import DataBox from "../DataBox";
import { ICONS } from "../../constants";

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

const Link = styled.a`
  font-weight: bold;
`;

const Icon = styled.img`
  width: 20px;
  filter: invert(43%) sepia(36%) saturate(4084%) hue-rotate(332deg)
    brightness(115%) contrast(103%);
`;

type Props = {};

const Notifications = (props: Props) => {
  return (
    <Wrapper>
      <DataBox
        size="small"
        LeftComponent={
          <TextIconWrapper>
            <Icon src={ICONS.WALLET} alt="notifications icon" />
            <Text
              value={
                <span>
                  Wallet balance low! <Link href="#add-funds">Add funds</Link>
                </span>
              }
              variant="body2"
            />
          </TextIconWrapper>
        }
      />
      <DataBox
        size="small"
        LeftComponent={
          <TextIconWrapper>
            <Icon src={ICONS.WORKFLOWS} alt="Workflows icon" />
            <Text
              value="Workflow Google Sheets - Moloch DAO Test Error"
              variant="body2"
            />
          </TextIconWrapper>
        }
      />
      <DataBox
        size="small"
        LeftComponent={
          <TextIconWrapper>
            <Icon src={ICONS.WORKFLOWS} alt="Workflows icon" />
            <Text
              value="Workflow Google Sheets - Moloch DAO Test Error"
              variant="body2"
            />
          </TextIconWrapper>
        }
      />
    </Wrapper>
  );
};

export default Notifications;
