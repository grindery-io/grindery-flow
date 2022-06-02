import React, { useState, createContext, useContext } from "react";
import gsheetConnector from "../samples/gsheet-connector.json";
import molochXdaiConnector from "../samples/moloch-xdai-connector.json";
import { Workflow } from "../types/Workflow";

type ContextProps = {
  state: any;
  setState?: (a: any) => void;
  connectors?: any[];
  workflow?: Workflow;
  setWorkflow: (a: any) => void;
  connectorsWithTriggers: any[];
  connectorsWithActions: any[];
  triggerIsSet: boolean;
  actionIsSet: boolean;
  triggerIsAuthenticated: boolean;
  triggerIsConfigured: boolean;
  trigger: any;
  availableTriggers: any[];
  availableActions: any[];
  action: any;
  triggerConnector: any;
  actionConnector: any;
  triggerConnectorIsSet: boolean;
  actionConnectorIsSet: boolean;
  triggerConfigSubmitted: boolean;
  setTriggerConfigSubmitted: (a: any) => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [state, setState] = useState({});
  const connectors = [gsheetConnector, molochXdaiConnector];
  const [workflow, setWorkflow] = useState<Workflow>({
    title: "New workflow",
    trigger: {
      type: "trigger",
      connector: "",
      operation: "",
      input: {},
    },
    actions: [
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
      },
    ],
    creator: "demo:user",
  });

  const [triggerConfigSubmitted, setTriggerConfigSubmitted] = useState(false);

  const connectorsWithTriggers = connectors?.filter(
    (connector) =>
      connector && connector.triggers && connector.triggers.length > 0
  );
  const connectorsWithActions = connectors?.filter(
    (connector) =>
      connector && connector.actions && connector.actions.length > 0
  );

  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );

  const actionIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].operation
  );

  const triggerConnectorIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );

  const actionConnectorIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].connector
  );

  const triggerIsAuthenticated = Boolean(
    workflow && workflow.trigger && workflow.trigger.authentication
  );

  const workflowTriggerConnector = workflow?.trigger.connector;
  const workflowTriggerOperation = workflow?.trigger.operation;
  const workflowActionConnector = workflow?.actions[0].connector;
  const workflowActionOperation = workflow?.actions[0].operation;

  const triggerConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowTriggerConnector
  );

  const trigger = triggerConnector?.triggers.find(
    (connectorTrigger: { name: any }) =>
      connectorTrigger && connectorTrigger.name === workflowTriggerOperation
  );

  const actionConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowActionConnector
  );

  const action = actionConnector?.actions.find(
    (connectorAction: { name: any }) =>
      connectorAction && connectorAction.name === workflowActionOperation
  );

  const requiredTriggerFields =
    (trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields
        .filter((field: { required: any }) => field && field.required)
        .map((field: { key: any }) => field.key)) ||
    [];

  const triggerIsConfigured = Boolean(
    triggerConfigSubmitted &&
      requiredTriggerFields.filter(
        (field: string) =>
          workflow &&
          workflow.trigger &&
          workflow.trigger.input &&
          workflow.trigger.input[field]
      ).length === requiredTriggerFields.length
  );

  const selectedTriggerConnector = connectorsWithTriggers?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow?.trigger.connector
  );

  const selectedActionConnector = connectorsWithActions?.find(
    (connector) =>
      connector &&
      connector.name &&
      connector.name === workflow?.actions[0].connector
  );

  const availableTriggers =
    (triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
    [];

  const availableActions =
    (triggerConnectorIsSet &&
      selectedActionConnector &&
      selectedActionConnector.actions) ||
    [];

  console.log("workflow", workflow);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        connectors,
        workflow,
        setWorkflow,
        connectorsWithActions,
        connectorsWithTriggers,
        triggerIsSet,
        actionIsSet,
        triggerIsAuthenticated,
        triggerIsConfigured,
        trigger,
        availableTriggers,
        availableActions,
        action,
        triggerConnector,
        actionConnector,
        triggerConnectorIsSet,
        actionConnectorIsSet,
        triggerConfigSubmitted,
        setTriggerConfigSubmitted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
