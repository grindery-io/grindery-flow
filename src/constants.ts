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
};

export const RIGHTBAR_TABS: { name: string; icon?: string }[] = [
  {
    name: "DASHBOARD",
    icon: ICONS.DASHBOARD,
  },
  {
    name: "NEW_WORKFLOW",
    icon: ICONS.WORKFLOWS,
  },
  {
    name: "WORKFLOW_LIST",
    icon: ICONS.WORKFLOWS,
  },
  {
    name: "APPS",
    icon: ICONS.APPS,
  },
  {
    name: "HISTORY",
    icon: ICONS.HISTORY,
  },
  {
    name: "TRANSACTIONS",
    icon: ICONS.TRANSACTIONS,
  },
  {
    name: "NOTIFICATIONS",
    icon: ICONS.BELL,
  },
  {
    name: "SETTINGS",
    icon: ICONS.SETTINGS,
  },
];
