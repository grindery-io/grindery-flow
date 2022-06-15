import React from "react";
import styled from "styled-components";
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import { Button } from "grindery-ui";
import { ICONS } from "../../constants";

const ButtonWrapper = styled.div`
  & .MuiButton-startIcon > img {
    background: none;
    border: none;
    padding: 0;
  }
`;

declare global {
  interface Window {
    ethereum: any;
  }
}

async function createAuthProvider() {
  // The following assumes there is an injected `window.ethereum` provider
  const addresses = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return new EthereumAuthProvider(window.ethereum, addresses[0]);
}

type Props = {};

const ConnectButton = (props: Props) => {
  const [connection, connect] = useViewerConnection();

  return connection.status === "connected" ? null : "ethereum" in window ? (
    <ButtonWrapper>
      <Button
        disabled={connection.status === "connecting"}
        onClick={() => {
          createAuthProvider().then(connect);
        }}
        icon={ICONS.GRINDERY}
        value="Sign in"
      />
    </ButtonWrapper>
  ) : (
    <p style={{ textAlign: "center" }}>
      An injected Ethereum provider such as{" "}
      <a href="https://metamask.io/" target="_blank" rel="noreferrer">
        MetaMask
      </a>{" "}
      is needed to authenticate.
    </p>
  );
};

export default ConnectButton;
