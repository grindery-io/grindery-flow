import axios from "axios";
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
    switch (type) {
      case "integer":
        return "number";
      case "text":
        return "string";
      case "datetime":
        return "date";
      case "file":
        return "string";
      case "password":
        return "string";
      case "copy":
        return "string";
      case "code":
        return "string";
      default:
        return type;
    }
  };
  const schema: any = {};
  inputFields.forEach((field: Field) => {
    schema[field.key] = {
      type: sanitizeType(field.type || ""),
      ...field.validation,
      optional: !field.required,
      empty: !field.required,
    };
    if (field.list) {
      schema[field.key].items = {
        type: sanitizeType(field.type || ""),
        empty: !field.required,
      };
      schema[field.key].type = "array";
    }
  });

  return schema;
};

export const getStagingConnectors = async () => {
  const WEB2_CONNECTORS_PATH =
    "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web2?ref=staging";

  const WEB3_CONNECTORS_PATH =
    "https://api.github.com/repos/grindery-io/grindery-nexus-schema-v2/contents/cds/web3?ref=staging";
  const responses = [];
  const web2Connectors = await axios.get(WEB2_CONNECTORS_PATH);
  for (let i = 0; i < web2Connectors.data.length; i++) {
    const url = web2Connectors.data[i].download_url;
    if (url) {
      responses.push(await axios.get(url));
    }
  }
  const web3Connectors = await axios.get(WEB3_CONNECTORS_PATH);
  for (let i = 0; i < web3Connectors.data.length; i++) {
    const url = web3Connectors.data[i].download_url;
    if (url) {
      responses.push(await axios.get(url));
    }
  }

  return responses
    .filter((res) => res && res.data)
    .map((res) => ({
      ...res.data,
      html_url:
        (Array.isArray(web3Connectors.data) &&
          web3Connectors.data.find(
            (c) => c.name && c.name.includes(res.data.key)
          ) &&
          web3Connectors.data.find(
            (c) => c.name && c.name.includes(res.data.key)
          ).html_url) ||
        (Array.isArray(web2Connectors.data) &&
          web2Connectors.data.find(
            (c) => c.name && c.name.includes(res.data.key)
          ) &&
          web2Connectors.data.find(
            (c) => c.name && c.name.includes(res.data.key)
          ).html_url) ||
        "",
    }));
};
