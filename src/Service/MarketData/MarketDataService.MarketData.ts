import { PagedResult } from "./Data/Response";
import { Output, Input } from "./Data/MarketDataEntity";
import {
  isValidProvider,
  isValidMarketDataName,
  validateRegisterMarketDataEntity,
  validateUpdateMarketDataEntity,
} from "../../Common/validators";
import * as L from "luxon";
import { IService } from "./MarketDataService";

export class MarketData {
  constructor(private _client: IService) {
  }
  /**
   * Read marketdata metadata by provider and curve name with MarketDataIdentifier
   * @param id MarketDataIdentifier of markedata to be retrieved
   * Returns MarketData Entity Output
   */
  ReadMarketDataRegistry(id: MarketDataIdentifier) {
    validate(id);
    var url = `marketdata/entity?provider=${id.provider}&curveName=${id.name}`;
    return this._client.get<Output>(url);
  }
  /**
   * Read marketdata metadata by id
   * @param id Id of the marketdata to be retrieved
   * Returns MarketData Entity Output
   */
  ReadMarketDataRegistryById(id: number) {
    if (id < 1) throw new Error("Id invalid :" + id);

    var url = "marketdata/entity/" + id;
    return this._client.get<Output>(url);
  }
  /**
   * Read paged set of available versions of the marketdata by id
   * @name rangeConfig
   * @param id Id of the marketdata to be retrieved
   * @param page Page number
   * @param pageSize Page size
   * @param product Market product in the case of Market Assessment
   * @param versionFrom Start date of version range
   * @param versionTo End date of version range
   * Returns Paged result of CurveRange entity
   */
  ReadCurveRange(rangeConfig: RangeConfig & { id: number }) {
    const { id, ...rest } = rangeConfig;
    const url = `marketdata/entity/${id}/curves?` + createQueryString(rest);

    return this._client.get<PagedResult<CurveRange>>(url);
  }
  /**
   * Register the given MarketData entity
   * @param metadata MarketDataEntity
   * Returns MarketData Entity Output
   */
  RegisterMarketData(metadata: Input) {
    validateRegisterMarketDataEntity(metadata);

    const url = "marketdata/entity";

    return this._client.post<Output>(url, metadata);
  }
  /**
   * Save the given MarketData entity
   * @param metadata MarketDataEntity
   * Returns MarketData Entity Output
   */
  UpdateMarketData(metadata: Input) {
    validateUpdateMarketDataEntity(metadata);
    const url = "marketdata/entity/" + metadata.MarketDataId;

    return this._client.put<Output>(url, metadata);
  }
  /**
   * Delete the specific MarketData entity by id
   * @param id Id of the marketdata to be deleted
   */
  DeleteMarketData(id: number) {
    const url = "marketdata/entity/" + id;

    return this._client.delete(url);
  }
}

export type MarketDataIdentifier = {
  provider: string;
  name: string;
};
type CurveRange = {
  marketDataId: number;
  product: string;
  version: Date;
  lastUpdated: Date;
  created: Date;
  rangeStart: Date;
  rangeEnd: Date;
};

type RangeConfig = {
  page: number;
  pageSize: number;
  product?: string;
  versionFrom?: Date;
  versionTo?: Date;
};

function createQueryString(obj: RangeConfig) {
  return Object.keys(obj)
    .map((k) => [k, (obj as any)[k]])
    .filter(([_, v]) => Boolean(v))
    .map(([k, v]) => {
      switch (k) {
        case "versionFrom":
        case "versionTo":
          return [
            k,
            L.DateTime.fromJSDate(v).toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          ];
        default:
          return [k, v];
      }
    })
    .map((x) => x.join("="))
    .join("&");
}

function validate(marketDataIdentifier: MarketDataIdentifier) {
  isValidProvider(marketDataIdentifier.provider, 1, 50);
  isValidMarketDataName(marketDataIdentifier.name, 1, 250);
}
