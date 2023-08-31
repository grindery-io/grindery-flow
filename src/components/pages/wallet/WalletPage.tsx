import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

interface IInitialState {
  phoneNumber: string;
  password: string;
  phoneCode: string;
}

const API_ID = 22237271;
const API_HASH = "1ea3b3cef03b4263e3af034d96928932";
const SESSION = new StringSession(
  JSON.parse(localStorage.getItem("grindery_tg_session") as string)
);

const client = new TelegramClient(SESSION, API_ID, API_HASH, {
  connectionRetries: 5,
}); // Immediately create a client using your application dat

const initialState: IInitialState = {
  phoneNumber: "",
  password: "",
  phoneCode: "",
}; // Initialize component initial state

type Props = {};

const WalletPage = (props: Props) => {
  const [{ phoneNumber, password, phoneCode }, setAuthInfo] =
    useState<IInitialState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const session = client;
  async function sendCodeHandler(): Promise<void> {
    await client.connect(); // Connecting to the server
    await client.sendCode(
      {
        apiId: API_ID,
        apiHash: API_HASH,
      },
      phoneNumber
    );
  }

  async function clientStartHandler(): Promise<void> {
    try {
      await client.start({
        phoneNumber,
        password: userAuthParamCallback(password),
        phoneCode: userAuthParamCallback(phoneCode),
        onError: () => {},
      });
      localStorage.setItem(
        "grindery_tg_session",
        JSON.stringify(client.session.save())
      ); // Save session to local storage
      await client.sendMessage("me", {
        message: "You're successfully logged in!",
      });
    } catch (error) {
      console.dir(error);
      // Error handling logic
      setError(JSON.stringify(error, null, 2));
    }
  }

  function inputChangeHandler({
    target: { name, value },
  }: BaseSyntheticEvent): void {
    setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }));
  }

  function userAuthParamCallback<T>(param: T): () => Promise<T> {
    return async function () {
      return await new Promise<T>((resolve) => {
        resolve(param);
      });
    };
  }

  async function connectNow() {
    try {
      await client.connect();
      // @ts-ignore
      const result: Api.contacts.Contacts = await client.invoke(
        new Api.contacts.GetContacts({
          // @ts-ignore
          hash: BigInt("-4156887774564"),
        })
      );
      console.log(result.users); // prints the result
    } catch (e) {
      //
    }
  }

  useEffect(() => {}, [session]);

  useEffect(() => {
    connectNow();
  }, []);

  console.log("tg client connected", session.connected);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        gap: "20px",
        margin: "40px 0",
      }}
    >
      <div>
        <label>phone</label>
        <br />
        <input
          value={phoneNumber}
          onChange={inputChangeHandler}
          type="phone"
          name="phoneNumber"
        />
      </div>
      <div>
        <label>password</label>
        <br />
        <input
          value={password}
          onChange={inputChangeHandler}
          type="password"
          name="password"
        />
      </div>
      <input type="button" value="start client" onClick={sendCodeHandler} />

      <div>
        <label>code</label>
        <br />
        <input
          value={phoneCode}
          onChange={inputChangeHandler}
          type="number"
          name="phoneCode"
        />
      </div>
      <input type="button" value="insert code" onClick={clientStartHandler} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletPage;
