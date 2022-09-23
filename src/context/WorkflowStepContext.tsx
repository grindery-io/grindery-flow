import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  setConnector: (connector: Connector | null) => void;
  setActiveRow: (row: number) => void;
  setUsername: (name: string) => void;
  getConnector: (key: string) => void;
  setInputError: (a: string) => void;
  setErrors: (a: any) => void;
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
  setConnector: defaultFunc,
  setActiveRow: defaultFunc,
  setUsername: defaultFunc,
  getConnector: defaultFunc,
  setInputError: defaultFunc,
  setErrors: defaultFunc,
});

export const WorkflowStepContextProvider = ({
  children,
  type,
  index,
  step,
  setOutputFields,
}: WorkflowStepContextProviderProps) => {
  const { client } = useAppContext();
  const { workflow } = useWorkflowContext();
  const [activeRow, setActiveRow] = useState(0);
  const [username, setUsername] = useState("");
  const [connector, setConnector] = useState<null | Connector>(null);
  const [inputError, setInputError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  const [operation, setOperation] = useState<
    null | undefined | Trigger | Action
  >(null);

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
        setConnector,
        setActiveRow,
        setUsername,
        getConnector,
        setInputError,
        setErrors,
      }}
    >
      {children}
    </WorkflowStepContext.Provider>
  );
};

export default WorkflowStepContextProvider;
