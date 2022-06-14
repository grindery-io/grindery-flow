const workflows = [
  {
    id: 1,
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "googleSheets",
    },
    actions: [
      {
        type: "action",
        connector: "molochOnXDai",
      },
    ],
    enabled: true,
  },
  {
    id: 2,
    name: "Name your workflow",
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "googleSheets",
    },
    actions: [
      {
        type: "action",
        connector: "molochOnXDai",
      },
    ],
    enabled: true,
  },
  {
    id: 3,
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "googleSheets",
    },
    actions: [
      {
        type: "action",
        connector: "molochOnXDai",
      },
    ],
    enabled: true,
  },
  {
    id: 4,
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "googleSheets",
    },
    actions: [
      {
        type: "action",
        connector: "molochOnXDai",
      },
    ],
    enabled: false,
  },
  {
    id: 5,
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "googleSheets",
    },
    actions: [
      {
        type: "action",
        connector: "molochOnXDai",
      },
    ],
    enabled: false,
  },
];

export default workflows;
