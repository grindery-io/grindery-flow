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
  const { connection, connectUser } = useGrinderyNexus();

  return connection?.status === "connected" ? null : "ethereum" in window ? (
    <Button
      onClick={() => {
        if (connection?.status !== "connecting") {
          connectUser();
        }
      }}
      icon={ICONS.CERAMIC_LOGO}
      value="Sign in"
      loading={connection?.status === "connecting"}
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
