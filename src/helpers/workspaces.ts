import axios from "axios";
import { WORKFLOW_ENGINE_URL } from "../constants";
import { jsonrpcObj } from "./utils";

export const workspacesRequest = async (
  method: string,
  params: any,
  token: string
) => {
  return await axios.post(WORKFLOW_ENGINE_URL, jsonrpcObj(method, params), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
