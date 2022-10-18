import React from "react";
import styled from "styled-components";
import { ICONS } from "../../constants";
import Button from "./Button";
import { useGrinderyNexus } from "use-grindery-nexus";

declare global {
  interface Window {
    ethereum: any;
  }
}

const FlowConnectButtonWrapper = styled.div`
  .MuiButton-root {
    margin-top: 0 !important;
  }
`;

type Props = {};

const ConnectButton = (props: Props) => {
  const { connect, user, connectFlow } = useGrinderyNexus();

  return user ? null : (
    <>
      {"ethereum" in window ? (
        <Button
          onClick={() => {
            connect();
          }}
          icon={ICONS.METAMASK_LOGO}
          value="Connect MetaMask"
          hideIconBorder
        />
      ) : (
        <p style={{ textAlign: "center" }}>
          An injected Ethereum provider such as{" "}
          <a href="https://metamask.io/" target="_blank" rel="noreferrer">
            MetaMask
          </a>{" "}
          is needed to authenticate with EVM wallet.
        </p>
      )}
      <FlowConnectButtonWrapper>
        <Button
          onClick={() => {
            connectFlow();
          }}
          icon={ICONS.FLOW_LOGO}
          value="Connect Flow Wallet"
          hideIconBorder
        />
      </FlowConnectButtonWrapper>
    </>
  );
};

export default ConnectButton;
