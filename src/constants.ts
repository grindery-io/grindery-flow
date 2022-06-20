export const SCREEN = {
  DESKTOP: "1024px",
  PHONE: "576px",
};

export const WORKFLOW_ENGINE_URL = "https://gnexus-orchestrator.herokuapp.com";

export const ICONS: { [key: string]: string } = {
  WALLET: "/images/icons/wallet.svg",
  WORKFLOWS: "/images/icons/workflow.svg",
  APPS: "/images/icons/grid.svg",
  HISTORY: "/images/icons/history.svg",
  BELL: "/images/icons/bell.svg",
  DASHBOARD: "/images/icons/dashboard.svg",
  SETTINGS: "/images/icons/settings.svg",
  TRANSACTIONS: "/images/icons/list.svg",
  EXECUTED: "/images/icons/executed.svg",
  ERROR: "/images/icons/error.svg",
  DEPOSIT: "/images/icons/deposit.svg",
  GAS: "/images/icons/gas.svg",
  SERVICE: "/images/icons/service.svg",
  FEES: "/images/icons/fees.svg",
  WITHDRAW: "/images/icons/withdraw.svg",
  COMMENT: "/images/icons/comment.svg",
  GRINDERY: "/images/icons/grindery.svg",
  PLUS: "/images/icons/plus.svg",
  PLUS_SMALL: "/images/icons/plus-small.svg",
  CREATE_WITHDRAW: "/images/icons/create-withdraw.svg",
  CREATE_DEPOSIT: "/images/icons/create-deposit.svg",
  CREATE_ALERT: "/images/icons/create-alert.svg",
  ARROW_RIGHT: "/images/icons/arrow-right.svg",
  CLOSE: "/images/icons/close.svg",
  PLUS_WHITE: "/images/icons/plus-white.svg",
  GAS_ALERT: "/images/icons/gas-alert.svg",
  SUCCESS_ALERT: "/images/icons/success-alert.svg",
  ERROR_ALERT: "/images/icons/error-alert.svg",
  MENU: "/images/icons/menu.svg",
  // CHAINS
  CHAIN_ETHEREUM: "/images/icons/ethereum.svg",
  CHAIN_ARBITRUM: "/images/icons/arbitrum.svg",
  CHAIN_GNOSIS: "/images/icons/gnosis.svg",
  CHAIN_POLYGON: "/images/icons/polygon.svg",
  CHAIN_CELO: "/images/icons/celo.svg",
};

export const RIGHTBAR_TABS: {
  name: string;
  icon?: string;
  id: number;
  label: string;
}[] = [
  {
    id: 0,
    name: "DASHBOARD",
    icon: ICONS.DASHBOARD,
    label: "Dashboard",
  },
  {
    id: 1,
    name: "WORKFLOWS",
    icon: ICONS.WORKFLOWS,
    label: "Workflows",
  },
  {
    id: 2,
    name: "APPS",
    icon: ICONS.APPS,
    label: "(d)Apps",
  },
  {
    id: 3,
    name: "HISTORY",
    icon: ICONS.HISTORY,
    label: "History",
  },
  {
    id: 4,
    name: "TRANSACTIONS",
    icon: ICONS.TRANSACTIONS,
    label: "Transactions",
  },
  {
    id: 5,
    name: "NOTIFICATIONS",
    icon: ICONS.BELL,
    label: "Notifications",
  },
  {
    id: 6,
    name: "SETTINGS",
    icon: ICONS.SETTINGS,
    label: "Settings",
  },
];
