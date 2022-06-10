import React, { useState, createContext, useContext } from "react";
import _ from "lodash";
import { Workflow } from "../types/Workflow";
import { Connector, Field } from "../types/Connector";
import gsheetConnector from "../samples/gsheet-connector.json";
import molochXdaiConnector from "../samples/moloch-xdai-connector.json";
import helloworldConnector from "../samples/helloworld.json";
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
  triggerAuthenticationIsRequired: boolean;
  triggerAuthenticationFields: any[];
  updateWorkflow: (a: any) => void;
  actionIsConfigured: boolean;
  activeStep: number;
  setActiveStep: (a: any) => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [state, setState] = useState({});
  const connectors: Connector[] = [
    helloworldConnector,
    gsheetConnector,
    molochXdaiConnector,
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
    creator:
      "did:3:kjzl6cwe1jw149tlplc4bgnpn1v4uwk9rg9jkvijx0u0zmfa97t69dnqibqa2as",
  });
  const [activeStep, setActiveStep] = useState(1);

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
    requiredTriggerFields.filter(
      (field: string) =>
        workflow &&
        workflow.trigger &&
        workflow.trigger.input &&
        typeof workflow.trigger.input[field] !== "undefined" &&
        workflow.trigger.input[field] !== "" &&
        workflow.trigger.input[field] !== null
    ).length === requiredTriggerFields.length
  );

  const requiredActionFields =
    (action &&
      action.operation &&
      action.operation.inputFields &&
      action.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
    [];

  const actionIsConfigured = Boolean(
    requiredActionFields.filter(
      (field: string) =>
        workflow &&
        workflow.actions &&
        workflow.actions[0] &&
        workflow.actions[0].input &&
        workflow.actions[0].input[field]
    ).length === requiredActionFields.length
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

  const triggerAuthenticationIsRequired = Boolean(
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

  if (window.location.origin.includes("http://localhost")) {
    console.log("workflow", workflow);
  }

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
        triggerAuthenticationIsRequired,
        triggerAuthenticationFields,
        updateWorkflow,
        actionIsConfigured,
        activeStep,
        setActiveStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
