import React from "react";
import useTelegramContext from "../../hooks/useTelegramContext";

type Props = {};

const TelegramContacts = (props: Props) => {
  const {
    state: { contacts },
  } = useTelegramContext();

  return (
    <div style={{ textAlign: "left" }}>
      {contacts && contacts.length > 0 ? (
        <>
          <p style={{ margin: "20px" }}>Contacts:</p>
          <ul>
            {contacts.map((contact: any) => (
              <li key={contact.id} style={{ listStyleType: "none" }}>
                <h5>
                  {contact.firstName || contact.lastName
                    ? `${contact.firstName}${
                        contact.lastName ? " " + contact.lastName : ""
                      }`
                    : `@${contact.username}`}
                </h5>
                {contact.firstName || contact.lastName ? (
                  <p>Username: @{contact.username}</p>
                ) : null}
                <p>User Id: {contact.id}</p>
                <button>Show wallet address</button>
                <button>Send tokens</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ margin: "20px" }}>Your contacts list is empty.</p>
      )}
    </div>
  );
};

export default TelegramContacts;
