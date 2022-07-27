import _ from "lodash";
import {
  ActionOperation,
  Connector,
  Field,
  TriggerOperation,
} from "../types/Connector";

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
                  group: connector.name,
                }))
              : [];
          } else {
            return {
              value: `{{trigger.${outputField.key}}}`,
              label: outputField.label || outputField.key,
              reference: operation.sample?.[outputField.key],
              icon: connector.icon || "",
              group: connector.name,
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

export const defaultFunc = () => {};

export const getSelfIdCookie = () => {
  const cookieName = "self.id-local-id";
  const b = document.cookie.match(
    "(^|;)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
  );
  return b ? b.pop() : "";
};

export const getValidationScheme = (inputFields: Field[]) => {
  const sanitizeType = (type: string) => {
    if (type === "integer") {
      return "number";
    }
    if (
      type !== "string" &&
      type !== "boolean" &&
      type !== "number" &&
      type !== "address"
    ) {
      return "string";
    } else {
      return type;
    }
  };
  const schema: any = {};
  inputFields.forEach((field: Field) => {
    schema[field.key] = {
      type: field.validation?.type || sanitizeType(field.type || ""),
      optional: !field.required,
      empty: !field.required,
      ...field.validation,
    };
    if (field.type === "datetime") {
      schema[field.key].type = "date";
    }
    if (field.list) {
      schema[field.key].items = schema[field.key].type;
      schema[field.key].type = "array";
    }
  });

  return schema;
};
