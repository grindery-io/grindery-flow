import React from "react";
import useTelegramContext from "../../../hooks/useTelegramContext";
import TelegramAuth from "../../wallet/TelegramAuth";

type Props = {};

const WalletPage = (props: Props) => {
  const { state } = useTelegramContext();
  const {
    user: { telegram_session, patchwallet_telegram },
    contacts,
  } = state;

  return telegram_session ? (
    <div style={{ textAlign: "center" }}>
      {patchwallet_telegram && (
        <p style={{ margin: "20px" }}>
          Your wallet address: {patchwallet_telegram}
        </p>
      )}
      {contacts && contacts.length > 0 ? (
        <>
          <p style={{ margin: "20px" }}>Here is your contacts list:</p>
          <ul>
            {contacts.map((contact: any, index) => (
              <li key={index}>{JSON.stringify(contact)}</li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ margin: "20px" }}>Your contacts list is empty.</p>
      )}
    </div>
  ) : (
    <TelegramAuth />
  );
};

export default WalletPage;
