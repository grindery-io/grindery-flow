type WorkflowTrigger = {
  type: string;
  connector: string;
  operation: string;
  input: {};
  display: {};
  authentication: {};
};

type WorkflowAction = {
  type: string;
  connector: string;
  operation: string;
  input: any;
  display: {};
  authentication: {};
};

export type Workflow = {
  title: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  creator: string;
  signature: string;
};
