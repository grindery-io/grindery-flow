import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import { WORKFLOW_ENGINE_URL } from "../constants";
import { CircularProgress } from "grindery-ui";
import { useGrinderyLogin } from "use-grindery-login";

export type TelegramAuthUserInput = {
  phoneNumber: string;
  password: string;
  phoneCode: string;
};

export type TelegramUserData = {
  telegram_session: string;
};

type StateProps = {
  loading: boolean;
  input: TelegramAuthUserInput;
  error: string;
  userData: TelegramUserData;
  sessionLoading: boolean;
  phoneSubmitted: boolean;
  codeSubmitted: boolean;
};

type ContextProps = {
  state: StateProps;
  handleInputChange: (name: string, value: string) => void;
  submitPhoneNumber: () => void;
  submitPhoneCode: () => void;
  submitPassword: () => void;
};

type TelegramContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    loading: false,
    input: {
      phoneNumber: "",
      password: "",
      phoneCode: "",
    },
    error: "",
    userData: {
      telegram_session: "",
    },
    sessionLoading: true,
    phoneSubmitted: false,
    codeSubmitted: false,
  },
  handleInputChange: () => {},
  submitPhoneNumber: () => {},
  submitPhoneCode: () => {},
  submitPassword: () => {},
};

export const TelegramContext = createContext<ContextProps>(defaultContext);

export const TelegramContextProvider = ({ children }: TelegramContextProps) => {
  const { token } = useGrinderyLogin();
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      ...defaultContext.state,
    }
  );

  const checkTelegramSession = useCallback(async () => {
    if (!token?.access_token) {
      return;
    }
    try {
      const response = await axios.post(
        WORKFLOW_ENGINE_URL,
        {
          jsonrpc: "2.0",
          method: "or_getUserProps",
          id: new Date(),
          params: {
            props: ["telegram_session"],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + token?.access_token,
          },
        }
      );
      if (response.data.result.telegram_session) {
        setState({
          userData: {
            telegram_session: response.data.result.telegram_session,
          },
        });
      }
    } catch (error: any) {
      console.error(
        "checkTelegramSession error",
        JSON.stringify(error, null, 2)
      );

      setState({
        error: error?.response?.data?.error?.message || "Something went wrong",
      });
    }
    setState({
      sessionLoading: false,
    });
  }, [token?.access_token]);

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setState({
        error: "",
        input: {
          ...state.input,
          [name]: value,
        },
      });
    },
    [state.input]
  );

  const submitPhoneNumber = useCallback(async () => {
    if (!state.input.phoneNumber) {
      setState({
        error: "Phone number is required",
      });
      return;
    }
    setState({
      loading: true,
    });
    setTimeout(() => {
      setState({
        phoneSubmitted: true,
        loading: false,
      });
    }, 2000);
  }, [state.input.phoneNumber]);

  const submitPhoneCode = useCallback(async () => {
    if (!state.input.phoneCode) {
      setState({
        error: "Phone code is required",
      });
      return;
    }
    setState({
      loading: true,
    });
    setTimeout(() => {
      setState({
        codeSubmitted: true,
        loading: false,
      });
    }, 2000);
  }, [state.input.phoneCode]);

  const submitPassword = useCallback(async () => {
    if (!state.input.password) {
      setState({
        error: "Password is required",
      });
      return;
    }
    setState({
      loading: true,
    });
    setTimeout(() => {
      setState({
        userData: {
          ...state.userData,
          telegram_session: "telegram_session",
        },
        loading: false,
      });
    }, 2000);
  }, [state.input.password, state.userData]);

  useEffect(() => {
    checkTelegramSession();
  }, [checkTelegramSession]);

  console.log("telegram state", state);

  return token?.access_token ? (
    <TelegramContext.Provider
      value={{
        state,
        handleInputChange,
        submitPhoneNumber,
        submitPhoneCode,
        submitPassword,
      }}
    >
      {state.sessionLoading ? (
        <div style={{ textAlign: "center", margin: "80px auto" }}>
          <CircularProgress />
        </div>
      ) : (
        children
      )}
    </TelegramContext.Provider>
  ) : null;
};

export default TelegramContextProvider;
