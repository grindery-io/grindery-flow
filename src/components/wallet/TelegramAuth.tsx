import React from "react";
import useTelegramContext from "../../hooks/useTelegramContext";
import styled from "styled-components";
import Button from "../shared/Button";
import AlertBox from "../shared/AlertBox";

const Container = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  gap: 24px;
  max-width: 320px;
  margin: 20px auto;
  padding: 24px;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  margin: 0;
  padding: 0;
`;

const Subtitle = styled.h5`
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0;
  padding: 0;
`;

const Form = styled.form`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 240px;
  margin: 20px auto;

  & p.error {
    color: #ff5858;
    text-align: center;
    margin: 0;
    padding: 0;
    font-size: 14px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  gap: 4px;

  & label {
    font-size: 14px;
    line-height: 150%;
    text-align: center;
    font-family: "Roboto";
    color: #0b0d17;
    font-weight: bold;
  }

  & input {
    width: 100%;
    background: #f4f5f7;
    border-radius: 6px;
    padding: 7px 15px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    min-height: 44px;
    font-family: Roboto;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    text-align: center;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  & p {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
    text-align: center;

    &.error {
      color: #ff5858;
    }
  }
`;

type Props = {};

const TelegramAuth = (props: Props) => {
  const {
    state: {
      input: { phoneCode, phoneNumber, password },
      phoneSubmitted,
      loading,
      error,
      codeSubmitted,
    },
    handleInputChange,
    submitPhoneNumber,
    submitPhoneCode,
    submitPassword,
  } = useTelegramContext();

  return (
    <Container>
      <Title>Sign in with Telegram</Title>
      <Subtitle>
        Use Telegram credentials to grant Grindery access to your contacts list.
      </Subtitle>
      <Form>
        <InputGroup>
          <label>Phone number</label>
          <input
            type="phone"
            value={phoneNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleInputChange("phoneNumber", event.target.value);
            }}
            disabled={loading || phoneSubmitted}
          />
        </InputGroup>
        {phoneSubmitted && (
          <InputGroup>
            <label>Code</label>
            <input
              type="text"
              value={phoneCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange("phoneCode", event.target.value);
              }}
              disabled={loading || codeSubmitted}
            />
          </InputGroup>
        )}
        {codeSubmitted && (
          <InputGroup>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange("password", event.target.value);
              }}
              disabled={loading}
            />
          </InputGroup>
        )}

        {error && (
          <AlertBox color="error">
            <p style={{ fontSize: "14px" }}>{error}</p>
          </AlertBox>
        )}

        {!phoneSubmitted && (
          <Button
            loading={loading}
            disabled={loading}
            onClick={submitPhoneNumber}
            value="Submit"
          />
        )}
        {phoneSubmitted && !codeSubmitted && (
          <Button
            loading={loading}
            disabled={loading}
            onClick={submitPhoneCode}
            value="Submit"
          />
        )}
        {phoneSubmitted && codeSubmitted && (
          <Button
            loading={loading}
            disabled={loading}
            onClick={submitPassword}
            value="Submit"
          />
        )}
      </Form>
    </Container>
  );
};

export default TelegramAuth;
