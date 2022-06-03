type WorkflowTrigger = {
  type: string;
  connector: string;
  operation: string;
  input: any;
  display?: any;
  authentication?: any;
  credentials?: any;
};

type WorkflowAction = {
  type: string;
  connector: string;
  operation: string;
  input: any;
  display?: any;
  authentication?: any;
  credentials?: any;
};

export type Workflow = {
  title: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  creator: string;
  signature?: string;
};
