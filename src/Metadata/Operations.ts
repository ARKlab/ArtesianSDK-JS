import { AxiosInstance } from "axios";
import { Output } from "./Data/MarketData";

export class Operations {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  PerformOperations(operations: Operations) {
    const url = "/marketdata/operations";

    return this._client.post<Output[]>(url, operations);
  }
}
