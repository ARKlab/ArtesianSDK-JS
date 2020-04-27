import { validateCustomFilter } from './../../Common/validators';
import { PagedResult } from "./Data/Response";
import { IService } from './MarketDataService';

export class CustomFilterSDK {
  constructor(private _client: IService) {
  }
  /**
   * Create a new Filter
   * @param filter the entity we are going to insert
   * Returns Custom Filter Entity
   */
  Create(filter: CustomFilter) {
    validateCustomFilter(filter);
    var url = "filter";

    return this._client.post<CustomFilter>(url, filter);
  }
  /**
   * Update specific Filter
   * @param filterId the entity id
   * @param filter the entity we are going to update
   * Returns Custom Filter Entity
   */
  Update(filterId: number, filter: CustomFilter) {
    validateCustomFilter(filter);
    var url = "filter/" + filterId;

    return this._client.put<CustomFilter>(url, filter);
  }
  /**
   * Read specific filter
   * @param filterId the entity id to get
   * Returns Custom Filter Entity
   */
  GetById(filterId: number) {
    var url = "filter/" + filterId;

    return this._client.get<CustomFilter>(url);
  }
  /**
   * Remove specific Filter
   * @param filterId the entity id to be removed
   * Returns Custom Filter Entity
   */
  Delete(filterId: number) {
    var url = "filter/" + filterId;

    return this._client.delete(url);
  }
  /**
   * Read all filters
   * @param page The requested page
   * @param pageSize The results to be queried per page
   * Returns Paged Result of Custom Filter Entity
   */
  Get(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1){
        throw new Error("Page and Page number need to be greater than 0. Page:" + page + " Page Size:" + pageSize);
    }
    var url = "filter?" + [`page=${page}` + `pageSize=${pageSize}`].join("&");

    return this._client.get<PagedResult<CustomFilter>>(url);
  }
}
export type CustomFilter = {
  id: number;
  name: string;
  searchText: string;
  filters?: Record<string, string[]>;
  eTag?: string;
};
