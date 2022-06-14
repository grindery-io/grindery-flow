import React, { useState, createContext, useContext, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { useViewerConnection } from "@self.id/react";
import { Workflow } from "../types/Workflow";
import { Connector, Field } from "../types/Connector";
import gsheetConnector from "../samples/connectors/gsheet.json";
import molochXdaiConnector from "../samples/connectors/moloch-xdai.json";
import helloworldConnector from "../samples/connectors/helloworld.json";
import { formatWorkflow, jsonrpcObj, replaceTokens } from "../utils";
import { RIGHTBAR_TABS, WORKFLOW_ENGINE_URL } from "../constants";

type ContextProps = {
  user: any;
  setUser?: (a: any) => void;
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
  triggerAuthenticationIsRequired: boolean;
  triggerAuthenticationFields: any[];
  updateWorkflow: (a: any) => void;
  actionIsConfigured: boolean;
  activeStep: number;
  setActiveStep: (a: any) => void;
  activeTab: number;
  setActiveTab: (a: number) => void;
  changeTab: (a: string) => void;
  testWorkflowAction: (a: number) => { [key: string]: any } | void;
  disconnect: any;
  resetWorkflow: () => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({ children }: AppContextProps) => {
  // Auth hook
  const [connection, disconnect] = useViewerConnection();

  // User id
  const [user, setUser] = useState<any>(null);

  // workflow builder tab
  const [activeTab, setActiveTab] = useState(0);

  // loaded nexus connectors CDS
  const [connectors, setConnectors] = useState<Connector[]>([
    helloworldConnector,
    gsheetConnector,
    molochXdaiConnector,
  ]);

  // empty workflow declaration
  const blankWorkflow: Workflow = {
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
    creator: "",
  };

  // workflow state
  const [workflow, setWorkflow] = useState<Workflow>(blankWorkflow);

  // active workflow builde step
  const [activeStep, setActiveStep] = useState(1);

  // filter connectors that has triggers
  const connectorsWithTriggers = connectors?.filter(
    (connector) =>
      connector && connector.triggers && connector.triggers.length > 0
  );

  // filter connectors that has actions
  const connectorsWithActions = connectors?.filter(
    (connector) =>
      connector && connector.actions && connector.actions.length > 0
  );

  // check if trigger connector is selected
  const triggerConnectorIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );

  // check if action connector is selected
  const actionConnectorIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].connector
  );

  // check if trigger operation is selected
  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );

  // check if action operation is selected
  const actionIsSet = Boolean(
    workflow &&
      workflow.actions &&
      workflow.actions[0] &&
      workflow.actions[0].operation
  );

  // current workflow's trigger connector key
  const workflowTriggerConnector = workflow?.trigger.connector;

  // current workflow's trigger operation key
  const workflowTriggerOperation = workflow?.trigger.operation;

  // current workflow's action connector key
  const workflowActionConnector = workflow?.actions[0].connector;

  // current workflow's action operation key
  const workflowActionOperation = workflow?.actions[0].operation;

  // current trigger's connector object
  const triggerConnector = connectors?.find(
    (connector) =>
      connector && connector.key && connector.key === workflowTriggerConnector
  );

  // current trigger object
  const trigger = triggerConnector?.triggers?.find(
    (connectorTrigger: { key: any }) =>
      connectorTrigger && connectorTrigger.key === workflowTriggerOperation
  );

  // current action's connector object
  const actionConnector = connectors?.find(
    (connector) =>
      connector && connector.key && connector.key === workflowActionConnector
  );

  // current action object
  const action = actionConnector?.actions?.find(
    (connectorAction: { key: any }) =>
      connectorAction && connectorAction.key === workflowActionOperation
  );

  // chech if trigger is authenticated (if required)
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

  // list trigger's required field names
  const requiredTriggerFields =
    (trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
    [];

  // check if trigger is configured (all required fields is set)
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

  // list action's required field names
  const requiredActionFields =
    (action &&
      action.operation &&
      action.operation.inputFields &&
      action.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
    [];

  // check if action is configured (all required fields is set)
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

  // current trigger's connector object
  const selectedTriggerConnector = connectorsWithTriggers?.find(
    (connector) =>
      connector &&
      connector.key &&
      connector.key === workflow?.trigger.connector
  );

  // current action's connector object
  const selectedActionConnector = connectorsWithActions?.find(
    (connector) =>
      connector &&
      connector.key &&
      connector.key === workflow?.actions[0].connector
  );

  // list available triggers for the selected connector
  const availableTriggers =
    (triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
    [];

  // list available actions for the selected connector
  const availableActions =
    (triggerConnectorIsSet &&
      selectedActionConnector &&
      selectedActionConnector.actions) ||
    [];

  // check if trigger authentication is required
  const triggerAuthenticationIsRequired = Boolean(
    triggerConnector && triggerConnector.authentication
  );

  // list trigger's authentication field names
  const triggerAuthenticationFields =
    (triggerConnector &&
      triggerConnector.authentication &&
      triggerConnector.authentication.fields &&
      triggerConnector.authentication.fields.length > 0 &&
      triggerConnector.authentication.fields.map(
        (field: { key: any }) => field && field.key
      )) ||
    [];

  // update current workflow
  const updateWorkflow = (data: any) => {
    let newWorkflow = { ...workflow };
    Object.keys(data).forEach((path) => {
      _.set(newWorkflow, path, data[path]);
    });
    setWorkflow(newWorkflow);
  };

  // reset current workflow
  const resetWorkflow = () => {
    setWorkflow({ ...blankWorkflow, creator: user || "" });
    setActiveStep(1);
  };

  // test current workflow's action by sending request to the workflow engine
  const testWorkflowAction = (index: number) => {
    if (workflow) {
      const readyWorkflow = {
        ...formatWorkflow(workflow),
        signature: JSON.stringify(formatWorkflow(workflow)),
      };
      if (window.location.origin.includes("http://localhost")) {
        console.log("readyWorkflow", readyWorkflow);
      }
      if (readyWorkflow.actions && readyWorkflow.actions[index]) {
        const currentAction = readyWorkflow.actions[index];
        const testInputValues: any = replaceTokens(currentAction.input || {}, {
          trigger: trigger?.operation?.sample || {},
        });

        const urlParams = new URLSearchParams(window.location.search);
        const testEngine = urlParams.get("testEngine");
        if (testEngine && testEngine === "1") {
          axios
            .post(
              WORKFLOW_ENGINE_URL,
              jsonrpcObj("or_testAction", {
                userAccountId: readyWorkflow.creator,
                step: currentAction,
                input: testInputValues,
              })
            )
            .then((res) => {
              if (res && res.data && res.data.error) {
                console.log("or_testAction error", res.data.error);
              }
              if (res && res.data && res.data.result) {
                console.log("or_testAction data", res.data.result);
              }
            })
            .catch((err) => {
              console.log("or_testAction error", err);
            });
        }
      }
    }
  };

  // change current active tab
  const changeTab = (name: string) => {
    setActiveTab(
      (RIGHTBAR_TABS.find((tab) => tab.name === name) || { id: 0 }).id
    );
  };

  // set user id on success authentication
  useEffect(() => {
    if (connection.status === "connected") {
      setUser(connection.selfID.id);
      updateWorkflow({
        creator: connection.selfID.id,
      });
    } else {
      setUser(null);
      updateWorkflow({
        creator: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  if (window.location.origin.includes("http://localhost")) {
    console.log("workflow", workflow);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
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
        triggerAuthenticationIsRequired,
        triggerAuthenticationFields,
        updateWorkflow,
        actionIsConfigured,
        activeStep,
        setActiveStep,
        activeTab,
        testWorkflowAction,
        changeTab,
        disconnect,
        resetWorkflow,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
