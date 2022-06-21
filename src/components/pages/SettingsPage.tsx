import React, { useState } from "react";
import styled from "styled-components";
import { Button, SelectSimple, SwitchInput } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import { SCREEN } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 110%;
  padding: 0;
  margin: 0 0 40px;
`;

const DisconnectWrapper = styled.div`
  margin: 40px 0 0;
`;

const DevModeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 0 0 10px;
`;

const Label = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  padding: 0;
  margin: 0;
`;

const HelpText = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: #000000;
  opacity: 0.6;
  padding: 0;
  margin: 0 0 20px;
`;

const CurrencySettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 0 0 10px;
`;

type Props = {};

const SettingsPage = (props: Props) => {
  const { disconnect } = useAppContext();
  const cachedDevMode = localStorage.getItem("gr_dev_mode");
  const cachedPrimaryCurrency = localStorage.getItem("gr_primary_currency");
  const [devMode, setDevMode] = useState(cachedDevMode === "true");
  const [currency, setCurrency] = useState(cachedPrimaryCurrency || "USD");

  const handleDevModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("gr_dev_mode", e.target.checked.toString());
    setDevMode(e.target.checked);
  };

  const handleCurrencyChange = (e: any) => {
    localStorage.setItem("gr_primary_currency", e.target.value);
    setCurrency(e.target.value);
  };

  return (
    <Wrapper>
      <Title>Settings</Title>

      <DevModeWrapper>
        <Label>Developer mode</Label>
        <SwitchInput value={devMode} onChange={handleDevModeChange} />
      </DevModeWrapper>
      <HelpText>
        This will enable a series of features intended for development and
        debugging. use them carefully or better don't use them at all.
      </HelpText>
      {devMode && (
        <>
          <CurrencySettingWrapper>
            <Label>Primary currency</Label>
            <div style={{ marginLeft: "auto" }}>
              <SelectSimple
                value={currency}
                options={[
                  { value: "USD", label: "USD" },
                  { value: "ETH", label: "ETH" },
                ]}
                onChange={handleCurrencyChange}
              />
            </div>
          </CurrencySettingWrapper>
        </>
      )}
      <DisconnectWrapper>
        <Button
          variant="outlined"
          onClick={() => {
            disconnect();
          }}
          value="Disconnect"
        />
      </DisconnectWrapper>
    </Wrapper>
  );
};

export default SettingsPage;
