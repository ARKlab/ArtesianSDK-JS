import {
  ArtesianServiceConfig,
  createApiKeyConfig,
  createAuthConfig,
  queryOptions
} from "../../Data/ArtesianServiceConfig";
import { ActualQuery } from "./ActualQuery";
import * as VQ from "./VersionedQuery";
import { MasQuery } from "./MasQuery";
import { QueryRoute, QueryVersion } from "./Data/Constants";
import { CircuitBreakerOptions } from "../../Common/CircuitBreaker";
import { RetryOptions } from "../../Common/Retry";
import { BulkheadOptions } from "../../Common/Bulkhead";
import { axiosWrapper } from "../../Common/AxiosWrapper";
import { IdPartitionStrategy } from "./Partition/IdPartitionStrategy";
import { requester } from "../../Common/ApiResilienceStrategy";

export interface IService {
  get: <a>(url: string) => Promise<a>;
}
class QueryService {
  client: IService;
  constructor(private cfg: ArtesianServiceConfig) {
    const requester = axiosWrapper(cfg);
    function Get<A>(url: string): Promise<A> {
      return requester({
        url: `${cfg.baseUrl}/${QueryRoute}/${QueryVersion}/${url}`
      });
    }
    this.client = {
      get: Get
    };
  }
  /**
   * Create Actual Time Serie Query
   */
  CreateActual() {
    return new ActualQuery(
      this.client,
      this.cfg.paritionStrategy || IdPartitionStrategy(this.cfg)
    );
  }
  /**
   * Create Versioned Time Serie Query
   */
  CreateVersioned() {
    return new VQ.VersionedQuery(
      this.client,
      this.cfg.paritionStrategy || IdPartitionStrategy(this.cfg)
    );
  }
  /**
   * Create Market Assessment Time Serie Query
   */
  CreateMas() {
    return new MasQuery(
      this.client,
      this.cfg.paritionStrategy || IdPartitionStrategy(this.cfg)
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
  queryOptions?: queryOptions;
  retryOptions?: RetryOptions;
  bulkheadOptions?: BulkheadOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  executionStrategy?: (r: requester) => requester;
}) {
  const queryConfig = cfg as Partial<{ baseUrl: string; key: string }>;
  if (typeof queryConfig.key == "undefined") throw "Must provide an api key";
  if (typeof queryConfig.baseUrl == "undefined")
    throw "Must provide a base Address to an Artesian tenant";

  return new QueryService(
    createApiKeyConfig({
      baseUrl: queryConfig.baseUrl,
      key: queryConfig.key,
      queryOptions: cfg.queryOptions,
      retryOptions: cfg.retryOptions,
      bulkheadOptions: cfg.bulkheadOptions,
      circuitBreakerOptions: cfg.circuitBreakerOptions,
      executionStrategy: cfg.executionStrategy
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
  queryOptions?: queryOptions;
  retryOptions?: RetryOptions;
  bulkheadOptions?: BulkheadOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  executionStrategy?: (r: requester) => requester;
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

  return new QueryService(
    createAuthConfig({
      baseUrl: queryConfig.baseUrl,
      audience: queryConfig.audience,
      domain: queryConfig.domain,
      clientId: queryConfig.clientId,
      clientSecret: queryConfig.clientSecret,
      queryOptions: cfg.queryOptions,
      retryOptions: cfg.retryOptions,
      circuitBreakerOptions: cfg.circuitBreakerOptions,
      bulkheadOptions: cfg.bulkheadOptions,
      executionStrategy: cfg.executionStrategy
    })
  );
}

export { RelativeIntervalType } from "./Data/Query";
export { Granularity, SystemTimeTransform } from "../../Data/Enums";
export const VersionedQuery = VQ;
