import { MarketDataServiceExtensions } from "./../../Factory/MarketDataServiceExtension";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ArtesianServiceConfig,
  createApiKeyConfig,
  createAuthConfig
} from "../../Data/ArtesianServiceConfig";
import { Acl } from "./MarketDataService.Acl";
import { Admin } from "./MarketDataService.Admin";
import { ApiKey as ApiKeySdk } from "./MarketDataService.ApiKey";
import { CustomFilterSDK } from "./MarketDataService.CustomFilter";
import { MarketData } from "./MarketDataService.MarketData";
import { Operations } from "./MarketDataService.Operations";
import { SearchFacet } from "./MarketDataService.SearchFacet";
import { TimeTransformSDK } from "./MarketDataService.TimeTransform";
import { UpsertCurve } from "./MarketDataService.UpsertCurve";
import "../../Common/ArtesianUtils";
import { BulkheadOptions } from "../../Common/Bulkhead";
import { CircuitBreakerOptions } from "../../Common/CircuitBreaker";
import { RetryOptions } from "../../Common/Retry";
import { axiosWrapper } from "../../Common/AxiosWrapper";
import { MetadataVersion } from "../../Data/Constants";

export class MarketDataService {
  client: AxiosInstance;
  Acl: Acl;
  Admin: Admin;
  ApiKey: ApiKeySdk;
  CustomFilter: CustomFilterSDK;
  MarketData: MarketData;
  Operations: Operations;
  SearchFacet: SearchFacet;
  TimeTransform: TimeTransformSDK;
  UpsertCurve: UpsertCurve;
  MarketDataServiceExtensions: MarketDataServiceExtensions;

  constructor(cfg: ArtesianServiceConfig) {
    const { Get, Post, Delete, Put, Request } = createApi(cfg);
    this.client = axios.create({ baseURL: cfg.baseUrl });
    this.client.get = Get;
    this.client.post = Post;
    this.client.delete = Delete;
    this.client.request = Request;
    this.client.put = Put;
    this.Acl = new Acl(this.client);
    this.Admin = new Admin(this.client);
    this.ApiKey = new ApiKeySdk(this.client);
    this.CustomFilter = new CustomFilterSDK(this.client);
    this.MarketData = new MarketData(this.client);
    this.Operations = new Operations(this.client);
    this.SearchFacet = new SearchFacet(this.client);
    this.TimeTransform = new TimeTransformSDK(this.client);
    this.UpsertCurve = new UpsertCurve(this.client);
    this.MarketDataServiceExtensions = new MarketDataServiceExtensions(
      this.client
    );
  }
}
/**
 * Create an instance of QueryService using apikey config
 * @param cfg Provide an api key and base url for the service
 */

export function FromApiKey(cfg: {
  baseUrl: string;
  key: string;
  retryOptions?: RetryOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  bulkheadOptions?: BulkheadOptions;
}) {
  const queryConfig = cfg as Partial<{ baseUrl: string; key: string }>;
  if (typeof queryConfig.key == "undefined") throw "Must provide an api key";
  if (typeof queryConfig.baseUrl == "undefined")
    throw "Must provide a base Address to an Artesian tenant";

  return new MarketDataService(
    createApiKeyConfig({
      baseUrl: queryConfig.baseUrl,
      key: queryConfig.key,
      retryOptions: cfg.retryOptions,
      circuitBreakerOptions: cfg.circuitBreakerOptions,
      bulkheadOptions: cfg.bulkheadOptions
    })
  );
}
/**
 * Create an instance of QueryService using auth config
 * @param cfg base url and required permissions to get an auth token
 */
export function FromAuthConfig(cfg: {
  baseUrl: string;
  audience: string;
  domain: string;
  clientId: string;
  clientSecret: string;
  retryOptions?: RetryOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  bulkheadOptions?: BulkheadOptions;
}) {
  const queryConfig = cfg as Partial<{
    baseUrl: string;
    audience: string;
    domain: string;
    clientId: string;
    clientSecret: string;
  }>;
  if (typeof queryConfig.baseUrl == "undefined")
    throw "Must provide a base Address to an Artesian tenant";

  if (typeof queryConfig.audience == "undefined")
    throw "Must provide a an auth audience";

  if (typeof queryConfig.domain == "undefined")
    throw "Must provide an auth domain";

  if (typeof queryConfig.clientId == "undefined")
    throw "Must provide an auth client";

  if (typeof queryConfig.clientSecret == "undefined")
    throw "Must provide an auth client secret";

  return new MarketDataService(
    createAuthConfig({
      baseUrl: queryConfig.baseUrl,
      audience: queryConfig.audience,
      domain: queryConfig.domain,
      clientId: queryConfig.clientId,
      clientSecret: queryConfig.clientSecret,
      retryOptions: cfg.retryOptions,
      circuitBreakerOptions: cfg.circuitBreakerOptions,
      bulkheadOptions: cfg.bulkheadOptions
    })
  );
}
function createApi(cfg: ArtesianServiceConfig) {
  const requester: <Response>(
    r: AxiosRequestConfig
  ) => Promise<Response> = axiosWrapper(cfg);
  return {
    Get<A>(url: string): Promise<A> {
      return requester<A>({ url: `${cfg.baseUrl}/${MetadataVersion}/${url}` });
    },
    Post<A>(url: string, data?: any, config?: AxiosRequestConfig): Promise<A> {
      return requester<A>({
        ...config,
        method: "post",
        url: `${cfg.baseUrl}/${MetadataVersion}/${url}`,
        data
      });
    },
    Delete(url: string) {
      return requester<any>({
        method: "delete",
        url: `${cfg.baseUrl}/${MetadataVersion}/${url}`
      });
    },
    Put<A>(url: string, data?: any): Promise<A> {
      return requester<A>({
        method: "put",
        url: `${cfg.baseUrl}/${MetadataVersion}/${url}`,
        data
      });
    },
    Request: requester
  };
}
