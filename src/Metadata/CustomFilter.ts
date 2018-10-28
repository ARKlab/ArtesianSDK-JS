import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class CustomFilterSDK {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  Create(filter: CustomFilter) {
    //todo validate
    var url = "/filter";

    return this._client.post<CustomFilter>(url, filter);
  }
  Update(filterId: number, filter: CustomFilter) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.put<CustomFilter>(url, filter);
  }
  GetById(filterId: number) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.get<CustomFilter>(url);
  }
  Delete(filterId: number) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.delete(url);
  }
  Get(page: number, pageSize: number) {
    //todo validate
    var url = "/filter?" + [`page=${page}` + `pageSize=${pageSize}`].join("&");

    return this._client.get<PagedResult<CustomFilter>>(url);
  }
}
type CustomFilter = {
  id: number;
  name: string;
  searchText: string;
  filters: Record<string, string[]>;
  eTag: string;
};
