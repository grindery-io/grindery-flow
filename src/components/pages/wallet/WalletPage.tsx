import React from "react";
import useTelegramContext from "../../../hooks/useTelegramContext";
import TelegramAuth from "../../wallet/TelegramAuth";

type Props = {};

const WalletPage = (props: Props) => {
  const { state } = useTelegramContext();
  const {
    user: { telegram_session },
    contacts,
  } = state;

  return telegram_session ? (
    <div style={{ textAlign: "center" }}>
      <p style={{ margin: "20px" }}>Welcome back!</p>
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
