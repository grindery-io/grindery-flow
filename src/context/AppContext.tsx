import React, { useState, createContext, useContext } from "react";
import _ from "lodash";
import { Workflow } from "../types/Workflow";
import { Connector, Field } from "../types/Connector";
import gsheetConnector from "../samples/gsheet-connector.json";
import molochXdaiConnector from "../samples/moloch-xdai-connector.json";
import molochEthereumConnector from "../samples/moloch-ethereum-connector.json";

type ContextProps = {
  state: any;
  setState?: (a: any) => void;
  connectors?: Connector[];
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
  isTriggerAuthenticationRequired: boolean;
  triggerAuthenticationFields: any[];
  updateWorkflow: (a: any) => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [state, setState] = useState({});
  const connectors: Connector[] = [
    gsheetConnector,
    molochXdaiConnector,
    molochEthereumConnector,
  ];
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
    signature: "",
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

  const triggerConnectorIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );

  const actionConnectorIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].connector
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

  const workflowTriggerConnector = workflow?.trigger.connector;
  const workflowTriggerOperation = workflow?.trigger.operation;
  const workflowActionConnector = workflow?.actions[0].connector;
  const workflowActionOperation = workflow?.actions[0].operation;

  const triggerConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowTriggerConnector
  );

  const trigger = triggerConnector?.triggers?.find(
    (connectorTrigger: { key: any }) =>
      connectorTrigger && connectorTrigger.key === workflowTriggerOperation
  );

  const actionConnector = connectors?.find(
    (connector) =>
      connector && connector.name && connector.name === workflowActionConnector
  );

  const action = actionConnector?.actions?.find(
    (connectorAction: { key: any }) =>
      connectorAction && connectorAction.key === workflowActionOperation
  );

  const triggerIsAuthenticated = Boolean(
    (triggerConnector && !triggerConnector.authentication) ||
      (workflow &&
        workflow.trigger &&
        workflow.trigger.input &&
        workflow.trigger.credentials &&
        triggerConnector &&
        triggerConnector.authentication &&
        triggerConnector.authentication.fields &&
        triggerConnector.authentication.fields.length > 0 &&
        triggerConnector.authentication.fields[0].key &&
        workflow.trigger.credentials[
          triggerConnector.authentication.fields[0].key
        ])
  );

  const requiredTriggerFields =
    (trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
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

  const isTriggerAuthenticationRequired = Boolean(
    triggerConnector && triggerConnector.authentication
  );

  const triggerAuthenticationFields =
    (triggerConnector &&
      triggerConnector.authentication &&
      triggerConnector.authentication.fields &&
      triggerConnector.authentication.fields.length > 0 &&
      triggerConnector.authentication.fields.map(
        (field: { key: any }) => field && field.key
      )) ||
    [];

  const updateWorkflow = (data: any) => {
    let newWorkflow = { ...workflow };
    Object.keys(data).forEach((path) => {
      _.set(newWorkflow, path, data[path]);
    });
    setWorkflow(newWorkflow);
  };

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
        isTriggerAuthenticationRequired,
        triggerAuthenticationFields,
        updateWorkflow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
