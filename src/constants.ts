export const SCREEN = {
  TABLET: "768px",
  TABLET_XL: "1024px",
  DESKTOP: "1280px",
  DESKTOP_XL: "1600px",
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
  BACK: "/images/icons/back.svg",
  COLLAPSE: "/images/icons/collapse.svg",
  CERAMIC_LOGO: "/images/icons/ceramic-logo.svg",
  JOIN_CONNECTORS: "/images/icons/join-connectors.svg",
  JOIN_ACTIONS: "/images/icons/join-actions.svg",
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
  path: string;
}[] = [
  {
    id: 0,
    name: "DASHBOARD",
    icon: ICONS.DASHBOARD,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 1,
    name: "WORKFLOWS",
    icon: ICONS.WORKFLOWS,
    label: "Workflows",
    path: "/workflows",
  },
  {
    id: 2,
    name: "APPS",
    icon: ICONS.APPS,
    label: "(d)Apps",
    path: "/d-apps",
  },
  {
    id: 3,
    name: "HISTORY",
    icon: ICONS.HISTORY,
    label: "History",
    path: "/history",
  },
  {
    id: 4,
    name: "TRANSACTIONS",
    icon: ICONS.TRANSACTIONS,
    label: "Transactions",
    path: "/transactions",
  },
  {
    id: 5,
    name: "NOTIFICATIONS",
    icon: ICONS.BELL,
    label: "Notifications",
    path: "/notifications",
  },
  {
    id: 6,
    name: "SETTINGS",
    icon: ICONS.SETTINGS,
    label: "Settings",
    path: "/settings",
  },
];

export const BLOCKCHAINS = [
  {
    value: "eip155:1",
    label: "Ethereum",
    icon: ICONS.CHAIN_ETHEREUM,
    token: "ETH",
  },
  {
    value: "eip155:42161",
    label: "Arbitrum",
    icon: ICONS.CHAIN_ARBITRUM,
    token: "ETH",
  },
  {
    value: "eip155:100",
    label: "Gnosis Chain",
    icon: ICONS.CHAIN_GNOSIS,
    token: "xDAI",
  },
  {
    value: "eip155:137",
    label: "Polygon",
    icon: ICONS.CHAIN_POLYGON,
    token: "MATIC",
    tokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  {
    value: "eip155:42220",
    label: "Celo",
    icon: ICONS.CHAIN_CELO,
    token: "CELO",
    tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  },
  {
    value: "BitCoin",
    label: "BitCoin",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Tron",
    label: "Tron",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Elrond",
    label: "Elrond",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Polkadot",
    label: "Polkadot",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Kusama",
    label: "Kusama",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Cardano",
    label: "Cardano",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Soloana",
    label: "Soloana",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Avalanche",
    label: "Avalanche",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Stellar",
    label: "Stellar",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Ripple",
    label: "Ripple",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Tezos",
    label: "Tezos",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Aurora",
    label: "Aurora",
    group: "Coming soon",
    disabled: true,
  },
];

export const WEB2_CONNECTORS_PATH =
  "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web2";

export const WEB3_CONNECTORS_PATH =
  "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web3";

export const COMING_SOON_TRIGGERS = [
  {
    value: "Email",
    label: "Email",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/email.png",
  },
  {
    value: "WebHook",
    label: "WebHook",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/webhook.png",
  },
  {
    value: "Storage",
    label: "Storage",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "MassMail",
    label: "MassMail",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Twitter",
    label: "Twitter",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Airtable",
    label: "Airtable",
    group: "Coming soon",
    disabled: true,
    icon: "/images/coming-soon/airtable.png",
  },
  {
    value: "Tyepform",
    label: "Tyepform",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Salesforce",
    label: "Salesforce",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Outlook",
    label: "Outlook",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Asana",
    label: "Asana",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Trello",
    label: "Trello",
    group: "Coming soon",
    disabled: true,
  },
];

export const COMING_SOON_ACTIONS = [
  {
    value: "Telegram",
    label: "Telegram",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Slack",
    label: "Slack",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Matter",
    label: "Matter",
    group: "Coming soon",
    disabled: true,
  },
  {
    value: "Element",
    label: "Element",
    group: "Coming soon",
    disabled: true,
  },
];
