import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class Enum {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }

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
        throw new Error("Page and Page number need to be greater than 0. Page:" + cfg.page + " Page Size:" + cfg.pageSize);
    }
    var url = "enums/operators?" + 
    [
        `page=${cfg.page}`,
        `pageSize=${cfg.pageSize}`,
        cfg.operatorFilter ? `operatorFilter=${cfg.operatorFilter}` : "",
        cfg.sort ? `sort=${cfg.sort.join(",")}` : ""
    ].filter(Boolean).join("&");

    return this._client.get<PagedResult<Operator>>(url);
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
        throw new Error("Page and Page number need to be greater than 0. Page:" + cfg.page + " Page Size:" + cfg.pageSize);
    }
    var url = "enums/units?" + 
    [
        `page=${cfg.page}`,
        `pageSize=${cfg.pageSize}`,
        cfg.unitFilter ? `unitFilter=${cfg.unitFilter}` : "",
        cfg.sort ? `sort=${cfg.sort.join(",")}` : ""
    ].filter(Boolean).join("&");

    return this._client.get<PagedResult<Operator>>(url);
  }
}

export type Operator = {
  id: number;
  operator: string;
};

export type Unit = {
  id: number;
  unit: string;
};