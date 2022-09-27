import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router";
import { isLocalOrStaging } from "../constants";
import { defaultFunc } from "../helpers/utils";
import useAppContext from "../hooks/useAppContext";
import useWorkflowContext from "../hooks/useWorkflowContext";
import { Action, Connector, Field, Trigger } from "../types/Connector";
import { Operation } from "../types/Workflow";

type WorkflowStepContextProps = {
  type: "trigger" | "action";
  index: number;
  step: number;
  activeRow: number;
  username: string;
  connector: null | Connector;
  operation: Trigger | Action | undefined | null;
  operationIsConfigured: boolean;
  operationIsAuthenticated: boolean;
  operationAuthenticationIsRequired: boolean;
  inputError: string;
  errors: any;
  operationIsTested: boolean;
  setConnector: (connector: Connector | null) => void;
  setActiveRow: (row: number) => void;
  setUsername: (name: string) => void;
  getConnector: (key: string) => void;
  setInputError: (a: string) => void;
  setErrors: (a: any) => void;
  setOperationIsTested: (a: boolean) => void;
};

type WorkflowStepContextProviderProps = {
  children: React.ReactNode;
  type: "trigger" | "action";
  index: number;
  step: number;
  setOutputFields: React.Dispatch<React.SetStateAction<any[]>>;
};

export const WorkflowStepContext = createContext<WorkflowStepContextProps>({
  type: "trigger",
  index: 0,
  step: 1,
  activeRow: 0,
  username: "",
  connector: null,
  operation: undefined,
  operationIsConfigured: false,
  operationIsAuthenticated: false,
  operationAuthenticationIsRequired: false,
  inputError: "",
  errors: false,
  operationIsTested: false,
  setConnector: defaultFunc,
  setActiveRow: defaultFunc,
  setUsername: defaultFunc,
  getConnector: defaultFunc,
  setInputError: defaultFunc,
  setErrors: defaultFunc,
  setOperationIsTested: defaultFunc,
});

export const WorkflowStepContextProvider = ({
  children,
  type,
  index,
  step,
  setOutputFields,
}: WorkflowStepContextProviderProps) => {
  let { key } = useParams();
  const { client } = useAppContext();
  const { workflow, updateWorkflow } = useWorkflowContext();
  const [activeRow, setActiveRow] = useState(0);
  const [username, setUsername] = useState("");
  const [connector, setConnector] = useState<null | Connector>(null);
  const [inputError, setInputError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  const [operation, setOperation] = useState<
    null | undefined | Trigger | Action
  >(null);
  const [operationIsTested, setOperationIsTested] = useState(false);

  //const operation =

  const workflowInput =
    type === "trigger" ? workflow.trigger.input : workflow.actions[index].input;

  const requiredFields = [
    ...((operation &&
      operation.operation &&
      operation.operation.inputFields &&
      operation.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
    ...((operation &&
      operation.inputFields &&
      operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
  ];

  const operationIsConfigured = Boolean(
    requiredFields.filter(
      (field: string) =>
        workflowInput &&
        typeof workflowInput[field] !== "undefined" &&
        workflowInput[field] !== "" &&
        workflowInput[field] !== null
    ).length === requiredFields.length &&
      (operation &&
      operation.operation &&
      operation.operation.type === "blockchain:event"
        ? workflowInput._grinderyChain && workflowInput._grinderyContractAddress
        : true) &&
      !inputError &&
      typeof errors === "boolean"
  );

  const operationIsAuthenticated = Boolean(
    (connector && !connector.authentication) ||
      (type === "trigger"
        ? workflow.trigger?.credentials && connector?.authentication
        : workflow.actions[index]?.credentials && connector?.authentication)
  );

  const operationAuthenticationIsRequired = Boolean(
    connector && connector.authentication
  );

  const passOutputFields = useCallback(() => {
    setOutputFields((outputFields: any[]) => {
      const workflowOutput = [...outputFields];
      workflowOutput[step - 1] = { connector, operation: operation?.operation };
      return workflowOutput;
    });
  }, [operation]);

  const getConnector = async (key: string) => {
    const res = await client?.getDriver(
      key,
      isLocalOrStaging ? "staging" : undefined
    );
    if (res) {
      setConnector(res);
    } else {
      setConnector(null);
    }
  };

  useEffect(() => {
    setOperation(
      type === "trigger"
        ? connector?.triggers?.find(
            (trigger) => trigger.key === workflow.trigger.operation
          )
        : connector?.actions?.find(
            (action) => action.key === workflow.actions[index].operation
          )
    );
  }, [connector, type, workflow]);

  useEffect(() => {
    passOutputFields();
  }, [passOutputFields]);

  useEffect(() => {
    if (type === "trigger") {
      updateWorkflow({
        "system.trigger.selected": operation ? true : false,
        "system.trigger.authenticated": operationIsAuthenticated ? true : false,
        "system.trigger.configured": operationIsConfigured ? true : false,
        "system.trigger.tested": true,
      });
    } else {
      updateWorkflow({
        ["system.actions[" + index + "].selected"]: operation ? true : false,
        ["system.actions[" + index + "].authenticated"]:
          operationIsAuthenticated ? true : false,
        ["system.actions[" + index + "].configured"]: operationIsConfigured
          ? true
          : false,
        ["system.actions[" + index + "].tested"]: key
          ? true
          : operationIsTested
          ? true
          : false,
      });
    }
  }, [
    operation,
    operationIsAuthenticated,
    operationIsConfigured,
    operationIsTested,
    key,
  ]);

  return (
    <WorkflowStepContext.Provider
      value={{
        type,
        index,
        step,
        activeRow,
        username,
        connector,
        operation,
        operationIsConfigured,
        operationIsAuthenticated,
        operationAuthenticationIsRequired,
        inputError,
        errors,
        operationIsTested,
        setConnector,
        setActiveRow,
        setUsername,
        getConnector,
        setInputError,
        setErrors,
        setOperationIsTested,
      }}
    >
      {children}
    </WorkflowStepContext.Provider>
  );
};

export default WorkflowStepContextProvider;
