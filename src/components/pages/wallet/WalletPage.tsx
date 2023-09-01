import React from "react";
import useTelegramContext from "../../../hooks/useTelegramContext";
import TelegramAuth from "../../wallet/TelegramAuth";
import TelegramContacts from "../../wallet/TelegramContacts";

type Props = {};

const WalletPage = (props: Props) => {
  const { state } = useTelegramContext();
  const {
    user: { telegram_session, patchwallet_telegram },
    contacts,
  } = state;

  return telegram_session ? (
    <div style={{ textAlign: "left" }}>
      {patchwallet_telegram && (
        <h2 style={{ margin: "20px" }}>
          Your wallet address: {patchwallet_telegram}
        </h2>
      )}
      <TelegramContacts />
    </div>
  ) : (
    <TelegramAuth />
  );
};

export default WalletPage;
