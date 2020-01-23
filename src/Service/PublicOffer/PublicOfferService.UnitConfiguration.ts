import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";
import { GenerationType } from './Data/Enums';


export class UnitConfiguration {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }

  /**
   * Read unit configuration mapping
   * @param unit The unit to read mappings for
   * Returns unit configuration mapping result
   */
  GetById(unit: string) {
    var url = `unitconfigurationmappings/${unit}`;
    return this._client.get<UnitConfigurationDto>(url);
  }
    /**
   * Read all unit configuration mappings
   * @name cfg
   * @param page The requested page
   * @param pageSize The results to be queried per page
   * @param unitFilter The unit filter
   * @param sort Sort by
   * Returns Paged Result of unit configuration mappings
   */
  Get(cfg: { page: number, pageSize: number, unitFilter: string | null, sort: string[] | null }) {

    var url = "unitconfigurationmappings?" + 
    [
        `page=${cfg.page}`,
        `pageSize=${cfg.pageSize}`,
        cfg.unitFilter ? `unitFilter=${cfg.unitFilter}` : "",
        cfg.sort ? `sort=${cfg.sort.join(",")}` : ""
    ].filter(Boolean).join("&");

    return this._client.get<PagedResult<UnitConfigurationDto>>(url);
  }
    /**
   * Delete unit configuration mapping
   * @param unit The unit to delete mappings for
   * Deletes unit configuration mapping
   */
  Delete(unit: string) {
    var url = `unitconfigurationmappings/${unit}`;
    return this._client.delete(url);
  }
  /**
   * Update the unit configuration mapping
   * @param unitCfg The unit configuration mapping to be upserted
   * Returns Unit configuration mapping
   */
  Upsert(unitCfg: UnitConfigurationDto) {
    var url = `unitconfigurationmappings/${unitCfg.Unit}`;
    return this._client.put<UnitConfigurationDto>(url, unitCfg);
  }
}

export type UnitConfigurationDto = {
  Unit: string;
  Mappings: GenerationTypeMapping[]
  ETag: string;
};

type GenerationTypeMapping = {
  GenerationType: GenerationType
  From: Date;
  To: Date;
};