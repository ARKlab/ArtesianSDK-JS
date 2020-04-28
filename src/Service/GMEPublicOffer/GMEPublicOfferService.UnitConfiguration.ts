import { PagedResult } from "./Data/Response";
import { GenerationType } from './Data/Enums';
import { IGMEPublicOfferService } from "./GMEPublicOfferService";


export class UnitConfiguration {
  constructor(private _client: IGMEPublicOfferService) {}

  /**
   * Read unit configuration mapping
   * @param unit The unit to read mappings for
   * Returns unit configuration mapping result
   */
  GetById(unit: string) {
    var url = `unitconfigurationmappings/${unit}`;
    return this._client.Get<UnitConfigurationDto>(url);
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

    return this._client.Get<PagedResult<UnitConfigurationDto>>(url);
  }
    /**
   * Delete unit configuration mapping
   * @param unit The unit to delete mappings for
   * Deletes unit configuration mapping
   */
  Delete(unit: string) {
    var url = `unitconfigurationmappings/${unit}`;
    return this._client.Delete(url);
  }
  /**
   * Update the unit configuration mapping
   * @param unitCfg The unit configuration mapping to be upserted
   * Returns Unit configuration mapping
   */
  Upsert(unitCfg: UnitConfigurationDto) {
    var url = `unitconfigurationmappings/${unitCfg.Unit}`;

    const data = {
      ...unitCfg,
      Mappings: unitCfg.Mappings.map(x => ({
        ...x,
        From: x.From.toISOString().split("T")[0],
        To: x.To.toISOString().split("T")[0]
      }))
    };
    return this._client.Put<UnitConfigurationDto>(url, data);
  }
}

export type UnitConfigurationDto = {
  Unit: string;
  Mappings: GenerationTypeMapping[];
  ETag: string | null;
};

type GenerationTypeMapping = {
  GenerationType: GenerationType
  From: Date;
  To: Date;
};