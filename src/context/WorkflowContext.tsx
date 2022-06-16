import React, { useState, createContext, useContext, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { Workflow } from "../types/Workflow";
import { Action, Connector, Field } from "../types/Connector";
import { formatWorkflow, jsonrpcObj, replaceTokens } from "../utils";
import { WORKFLOW_ENGINE_URL } from "../constants";

type WorkflowContextProps = {
  connectors?: Connector[];
  workflow?: Workflow;
  setWorkflow: (a: any) => void;
  connectorsWithTriggers: Connector[];
  connectorsWithActions: Connector[];
  triggerIsSet: boolean;
  actionIsSet: (i: number) => boolean;
  triggerIsAuthenticated: boolean;
  triggerIsConfigured: boolean;
  trigger: any;
  availableTriggers: any[];
  availableActions: (i: number) => Action[];
  action: (i: number) => Action | undefined;
  triggerConnector: any;
  actionConnector: (i: number) => Connector | undefined;
  triggerConnectorIsSet: boolean;
  actionConnectorIsSet: (i: number) => boolean;
  triggerAuthenticationIsRequired: boolean;
  triggerAuthenticationFields: any[];
  updateWorkflow: (a: any) => void;
  actionIsConfigured: (i: number) => boolean;
  activeStep: number;
  setActiveStep: (a: any) => void;
  testWorkflowAction: (a: number) => { [key: string]: any } | void;
  resetWorkflow: () => void;
  setConnectors: (a: Connector[]) => void;
  requiredActionFields: (i: number) => string[];
};

type WorkflowContextProviderProps = {
  children: React.ReactNode;
  user: string | null;
  availableConnectors: Connector[];
};

export const WorkflowContext = createContext<Partial<WorkflowContextProps>>({});

export const WorkflowContextProvider = ({
  user,
  children,
  availableConnectors,
}: WorkflowContextProviderProps) => {
  // loaded nexus connectors CDS
  const [connectors, setConnectors] = useState<Connector[]>(
    availableConnectors || []
  );

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
  const actionConnectorIsSet = (index: number) =>
    Boolean(
      workflow &&
        workflow.actions &&
        workflow.actions[index] &&
        workflow.actions[index].connector
    );

  // check if trigger operation is selected
  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );

  // check if action operation is selected
  const actionIsSet = (index: number) =>
    Boolean(
      workflow &&
        workflow.actions &&
        workflow.actions[index] &&
        workflow.actions[index].operation
    );

  // current workflow's trigger connector key
  const workflowTriggerConnector = workflow?.trigger.connector;

  // current workflow's trigger operation key
  const workflowTriggerOperation = workflow?.trigger.operation;

  // current workflow's action connector key
  const workflowActionConnector = (index: number) =>
    workflow?.actions[index].connector;

  // current workflow's action operation key
  const workflowActionOperation = (index: number) =>
    workflow?.actions[index].operation;

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
  const actionConnector = (index: number) =>
    connectors?.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflowActionConnector(index)
    );

  // current action object
  const action = (index: number) =>
    actionConnector(index)?.actions?.find(
      (connectorAction: { key: any }) =>
        connectorAction &&
        connectorAction.key === workflowActionOperation(index)
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
    ).length === requiredTriggerFields.length &&
      (trigger &&
      trigger.operation &&
      trigger.operation.type === "blockchain:event"
        ? workflow.trigger.input.blockchain
        : true)
  );

  // list action's required field names
  const requiredActionFields = (index: number) => {
    return (
      (action(index)?.operation?.inputFields || [])
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key) || []
    );
  };

  // check if action is configured (all required fields is set)
  const actionIsConfigured = (index: number) => {
    return Boolean(
      requiredActionFields(index).filter(
        (field: string) => workflow?.actions?.[index]?.input?.[field]
      ).length === requiredActionFields(index).length &&
        (action(index)?.operation?.type === "blockchain:call"
          ? workflow.actions[index].input.blockchain
          : true)
    );
  };

  // current trigger's connector object
  const selectedTriggerConnector = connectorsWithTriggers?.find(
    (connector) =>
      connector &&
      connector.key &&
      connector.key === workflow?.trigger.connector
  );

  // current action's connector object
  const selectedActionConnector = (index: number) =>
    connectorsWithActions?.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflow?.actions[index].connector
    );

  // list available triggers for the selected connector
  const availableTriggers =
    (triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
    [];

  // list available actions for the selected connector
  const availableActions = (index: number) =>
    (triggerConnectorIsSet && selectedActionConnector(index)?.actions) || [];

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

  // set user id on success authentication
  useEffect(() => {
    if (user) {
      updateWorkflow({
        creator: user,
      });
    } else {
      updateWorkflow({
        creator: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (window.location.origin.includes("http://localhost")) {
    console.log("workflow", workflow);
  }

  return (
    <WorkflowContext.Provider
      value={{
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
        testWorkflowAction,
        resetWorkflow,
        setConnectors,
        requiredActionFields,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflowContext = () => useContext(WorkflowContext);

export default WorkflowContextProvider;
