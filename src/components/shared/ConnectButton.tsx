import React from "react";
import { ICONS } from "../../constants";
import Button from "./Button";
import { useGrinderyNexus } from "use-grindery-nexus";

declare global {
  interface Window {
    ethereum: any;
  }
}

type Props = {};

const ConnectButton = (props: Props) => {
  const { connect, user } = useGrinderyNexus();

  return user ? null : "ethereum" in window ? (
    <Button
      onClick={() => {
        connect();
      }}
      icon={ICONS.METAMASK_LOGO}
      value="Connect"
      hideIconBorder
    />
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
