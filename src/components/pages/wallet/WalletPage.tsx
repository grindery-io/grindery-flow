import React from "react";
import useTelegramContext from "../../../hooks/useTelegramContext";
import TelegramAuth from "../../wallet/TelegramAuth";

type Props = {};

const WalletPage = (props: Props) => {
  const { state } = useTelegramContext();
  const {
    userData: { telegram_session },
  } = state;
  console.log("telegram_session", telegram_session);

  return telegram_session ? (
    <div style={{ textAlign: "center" }}>
      <p style={{ margin: "20px" }}>Welcome back!</p>
      <p style={{ margin: "20px" }}>Your contacts list is empty.</p>
    </div>
  ) : (
    <TelegramAuth />
  );
};

export default WalletPage;
