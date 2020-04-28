import { PagedResult } from "./Data/Response";
import { IGMEPublicOfferService } from "./GMEPublicOfferService";

export class Enum {
  constructor(private _client: IGMEPublicOfferService) {}

  /**
   * Read all operators
   * @name cfg
   * @param page The requested page
   * @param pageSize The results to be queried per page
   * @param operatorFilter The operator filter
   * @param sort Sort by
   * Returns Paged Result of Operators
   */
  GetOperators(cfg: { page: number, pageSize: number, operatorFilter: string | null, sort: string[] | null }) {
    if (cfg.page < 1 || cfg.pageSize < 1){
        return Promise.reject("Page and Page number need to be greater than 0. Page:" + cfg.page + " Page Size:" + cfg.pageSize);
    }
    var url = "enums/operators?" + 
    [
        `page=${cfg.page}`,
        `pageSize=${cfg.pageSize}`,
        cfg.operatorFilter ? `operatorFilter=${cfg.operatorFilter}` : "",
        cfg.sort ? `sort=${cfg.sort.join(",")}` : ""
    ].filter(Boolean).join("&");

    return this._client.Get<PagedResult<Operator>>(url);
  }
    /**
   * Read all units
   * @name cfg
   * @param page The requested page
   * @param pageSize The results to be queried per page
   * @param unitFilter The unit filter
   * @param sort Sort by
   * Returns Paged Result of Units
   */
  GetUnits(cfg: { page: number, pageSize: number, unitFilter: string | null, sort: string[] | null }) {
    if (cfg.page < 1 || cfg.pageSize < 1){
        return Promise.reject("Page and Page number need to be greater than 0. Page:" + cfg.page + " Page Size:" + cfg.pageSize);
    }
    var url = "enums/units?" + 
    [
        `page=${cfg.page}`,
        `pageSize=${cfg.pageSize}`,
        cfg.unitFilter ? `unitFilter=${cfg.unitFilter}` : "",
        cfg.sort ? `sort=${cfg.sort.join(",")}` : ""
    ].filter(Boolean).join("&");

    return this._client.Get<PagedResult<Unit>>(url);
  }
}

export type Operator = {
  Id: number;
  Operator: string;
};

export type Unit = {
  Id: number;
  Unit: string;
};