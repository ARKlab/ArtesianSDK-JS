import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class ApiKey {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  Create(keyRecord: Input) {
    //todo validate
    var url = "/apikey/entity";

    return this._client.post<Output>(url, keyRecord);
  }
  GetByKey(key: string) {
    var url = `/apikey/entity?key=${key}`;

    return this._client.get<Output>(url);
  }
  GetById(id: number) {
    var url = `/apikey/entity/${id}`;

    return this._client.get<Output>(url);
  }
  GetByUserId(page: number, pageSize: number, userId: string) {
    if (page < 1) throw "page needs to be greater than 0";
    if (pageSize < 1) throw "pageSize needs to be greater than 0";
    var url =
      "/apikey/entity?" +
      [`pageSize=${pageSize}`, `page=${page}`, `userId=${userId}`].join("&");

    return this._client.get<PagedResult<Output>>(url);
  }
  Delete(id: number) {
    var url = "/apikey/entity/" + id;

    this._client.delete(url);
  }
}
type Input = {
  id: number;
  eTag: string;
  usagePerDay?: number;
  expiresAt: Date;
  description: string;
};
type Output = {
  id: number;
  eTag: string;
  usagePerDay?: number;
  expiresAt: Date;
  description: string;
  userId: string;
  key: string;
  createdAt: Date;
};
