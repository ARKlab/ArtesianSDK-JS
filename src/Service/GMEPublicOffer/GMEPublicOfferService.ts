import { AxiosRequestConfig } from "axios";
import {
    ArtesianServiceConfig,
    createApiKeyConfig,
    createAuthConfig
  } from "../../Data/ArtesianServiceConfig";
import { axiosWrapper } from "../../Common/AxiosWrapper";
import { BulkheadOptions } from "../../Common/Bulkhead";
import { CircuitBreakerOptions } from "../../Common/CircuitBreaker";
import { RetryOptions } from "../../Common/Retry";
import { GMEPublicOfferVersion, GMEPublicOfferRoute } from "./Data/Constants";
import { Enum as Enum } from "./GMEPublicOfferService.Enum";
import { UnitConfiguration as UnitConfiguration } from "./GMEPublicOfferService.UnitConfiguration";
import { Query as Query } from "./GMEPublicOfferService.Query";



export class GMEPublicOfferService {
    Enum: Enum;
    UnitConfiguration: UnitConfiguration;
    Query: Query;
    client: IGMEPublicOfferService;

    constructor(cfg: ArtesianServiceConfig) {
      const wrappedApi = createApi(cfg);
      
      this.client = wrappedApi;
      this.Enum = new Enum(wrappedApi);
      this.UnitConfiguration = new UnitConfiguration(wrappedApi);
      this.Query = new Query(wrappedApi);
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
  
    return new GMEPublicOfferService(
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
  
    return new GMEPublicOfferService(
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
        return requester<A>({ url: `${cfg.baseUrl}/${GMEPublicOfferRoute}/${GMEPublicOfferVersion}/${url}` });
      },
      Post<A>(url: string, data?: any, config?: GMEPublicOfferService): Promise<A> {
        return requester<A>({
          ...config,
          method: "post",
          url: `${cfg.baseUrl}/${GMEPublicOfferRoute}/${GMEPublicOfferVersion}/${url}`,
          data
        });
      },
      Delete(url: string) {
        return requester<any>({
          method: "delete",
          url: `${cfg.baseUrl}/${GMEPublicOfferRoute}/${GMEPublicOfferVersion}/${url}`
        });
      },
      Put<A>(url: string, data?: any): Promise<A> {
        return requester<A>({
          method: "put",
          url: `${cfg.baseUrl}/${GMEPublicOfferRoute}/${GMEPublicOfferVersion}/${url}`,
          data
        });
      },
      Request: requester
    };
  }

  export type IGMEPublicOfferService = ReturnType<typeof createApi>