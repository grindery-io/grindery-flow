import _ from "lodash";
import { Workflow } from "./types/Workflow";

export const getParameterByName = (name: string, url = window.location.href) => {
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function replaceTokens<T>(obj: T, context: { [key: string]: unknown }): T {
  if (typeof obj === "string") {
    return obj.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_original, key) =>
      String((_.get(context, key, "") as string) ?? "")
    ) as unknown as T;
  }
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => replaceTokens(item, context)) as unknown as T;
    }
    return Object.entries(obj).reduce((acc:any, [key, value]) => {
      acc[key] = replaceTokens(value, context);
      return acc;
    }, {} as T);
  }
  return obj;
}

export const setConnectorKeys = (workflow: Workflow) => {
  return {
    ...workflow,
    trigger: {
      ...workflow.trigger,
     connector: _.camelCase(workflow.trigger.connector) 
    },
    actions: [
      ...workflow.actions.map(action=>({
        ...action,
        connector: _.camelCase(action.connector) 
      }))
    ]
  }
}