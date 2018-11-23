import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class CustomFilterSDK {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Create a new Filter
   * @param filter the entity we are going to insert
   * Returns Custom Filter Entity
   */
  Create(filter: CustomFilter) {
    //todo validate
    var url = "/filter";

    return this._client.post<CustomFilter>(url, filter);
  }
  /**
   * Update specific Filter
   * @param filterId the entity id
   * @param filter the entity we are going to update
   * Returns Custom Filter Entity
   */
  Update(filterId: number, filter: CustomFilter) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.put<CustomFilter>(url, filter);
  }
  /**
   * Read specific filter
   * @param filterId the entity id to get
   * Returns Custom Filter Entity
   */
  GetById(filterId: number) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.get<CustomFilter>(url);
  }
  /**
   * Remove specific Filter
   * @param filterId the entity id to be removed
   * Returns Custom Filter Entity
   */
  Delete(filterId: number) {
    //todo validate
    var url = "/filter/" + filterId;

    return this._client.delete(url);
  }
  /**
   * Read all filters
   * @param page The requested page
   * @param pageSize The results to be queried per page
   * Returns Paged Result of Custom Filter Entity
   */
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
  filters?: Record<string, string[]>;
  eTag?: string;
};
