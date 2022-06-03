export type Workflow = {
  title: string;
  trigger: Operation;
  actions: Operation[];
  creator: string;
  signature: string;
};

export type Operation = {
  type: "action" | "trigger";
  connector: string;
  operation: string;
  input: { [key: string]: string | number | boolean };
  display?: { [key: string]: string };
  authentication?: string;
  credentials?: { [key: string]: string | number | boolean };
};
