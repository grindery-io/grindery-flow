import _ from "lodash";
import {
  ActionOperation,
  Connector,
  TriggerOperation,
} from "./types/Connector";
import { Workflow } from "./types/Workflow";

export const getParameterByName = (
  name: string,
  url = window.location.href
) => {
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export function replaceSystemTokens<T>(obj: T): T {
  if (typeof obj === "string") {
    return obj.replace("{{;}}", " ") as unknown as T;
  }
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceSystemTokens(item)) as unknown as T;
    }
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      acc[key] = replaceSystemTokens(value);
      return acc;
    }, {} as T);
  }
  return obj;
}

export function replaceTokens<T>(
  obj: T,
  context: { [key: string]: unknown }
): T {
  if (typeof obj === "string") {
    return obj.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_original, key) =>
      String((_.get(context, key, "") as string) ?? "")
    ) as unknown as T;
  }
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceTokens(item, context)) as unknown as T;
    }
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      acc[key] = replaceTokens(value, context);
      return acc;
    }, {} as T);
  }
  return obj;
}

export const formatWorkflow = (workflow: Workflow) => {
  return {
    ...workflow,
    trigger: {
      ...workflow.trigger,
      connector: _.camelCase(workflow.trigger.connector),
      input: replaceSystemTokens(workflow.trigger.input),
    },
    actions: [
      ...workflow.actions.map((action) => ({
        ...action,
        connector: _.camelCase(action.connector),
        input: replaceSystemTokens(action.input),
      })),
    ],
  };
};

export const getOutputOptions = (
  operation: TriggerOperation | ActionOperation,
  connector: Connector
) => {
  if (!operation) {
    return [];
  } else {
    return _.flatten(
      operation.outputFields &&
        operation.outputFields.map((outputField: any) => {
          if (outputField.list) {
            const sampleInput = operation.sample?.[outputField.key];
            return Array.isArray(sampleInput)
              ? sampleInput.map((sample: any, i: any) => ({
                  value: `{{trigger.${outputField.key}[${i}]}}`,
                  label: `${outputField.label || outputField.key}[${i}]`,
                  reference: sample,
                  icon: connector.icon || "",
                }))
              : [];
          } else {
            return {
              value: `{{trigger.${outputField.key}}}`,
              label: outputField.label || outputField.key,
              reference: operation.sample?.[outputField.key],
              icon: connector.icon || "",
            };
          }
        })
    );
  }
};

export const jsonrpcObj = (method: string, params: object) => {
  return {
    jsonrpc: "2.0",
    method: method,
    id: new Date(),
    params,
  };
};
