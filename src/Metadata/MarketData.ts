import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";
import { Output, Input } from "./Data/MarketData";

export class MarketData {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  ReadMarketDataRegistry(id: MarketDataIdentifier) {
    //todo validate
    var url = `/marketdata/entity?provider=${id.provider}&curveName=${id.name}`;
    return this._client.get<Output>(url);
  }
  ReadMarketDataRegistryById(id: number) {
    //todo validate
    var url = "/marketdata/entity/" + id;
    return this._client.get<Output>(url);
  }
  ReadCurveRange(rangeConfig: {
    id: number;
    page: number;
    pageSize: number;
    product?: string;
    versionFrom?: Date;
    versionTo?: Date;
  }) {
    const { id, ...rest } = rangeConfig;
    const url = `/marketdata/entity/${id}/curves?` + ObjectToQueryString(rest);

    return this._client.get<PagedResult<CurveRange>>(url);
  }
  RegisterMarketData(metadata: Input) {
    //todo validate
    const url = "/marketdata/entity/";

    return this._client.post<Output>(url, metadata);
  }
  UpdateMarketData(metadata: Input) {
    //todo validate
    const url = "marketdata/entity/" + metadata.marketDataId;

    return this._client.put<Output>(url, metadata);
  }
  DeleteMarketData(id: number) {
    const url = "/marketdata/entity" + id;

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

function ObjectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(k => [k, obj[k]])
    .filter(([_, v]) => Boolean(v))
    .map(x => x.join("="))
    .join("&");
}
