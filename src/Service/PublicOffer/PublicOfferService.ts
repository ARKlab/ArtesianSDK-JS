import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
    ArtesianServiceConfig,
    createApiKeyConfig,
    createAuthConfig
  } from "../../Data/ArtesianServiceConfig";
import { axiosWrapper } from "../../Common/AxiosWrapper";
import { BulkheadOptions } from "../../Common/Bulkhead";
import { CircuitBreakerOptions } from "../../Common/CircuitBreaker";
import { RetryOptions } from "../../Common/Retry";
import { PublicOfferVersion, PublicOfferRoute } from "./Data/Constants";
import { Enum as Enum } from "./PublicOfferService.Enum";
import { UnitConfiguration as UnitConfiguration } from "./PublicOfferService.UnitConfiguration";


export class PublicOfferService {
    client: AxiosInstance;
    Enum: Enum;
    UnitConfiguration: UnitConfiguration;

    constructor(cfg: ArtesianServiceConfig) {
      const { Get, Post, Delete, Put, Request } = createApi(cfg);
      this.client = axios.create({ baseURL: cfg.baseUrl });
      this.client.get = Get;
      this.client.post = Post;
      this.client.delete = Delete;
      this.client.request = Request;
      this.client.put = Put;
      this.Enum = new Enum(this.client);
      this.UnitConfiguration = new UnitConfiguration(this.client);
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
  
    return new PublicOfferService(
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
  
    return new PublicOfferService(
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
        return requester<A>({ url: `${cfg.baseUrl}/${PublicOfferRoute}/${PublicOfferVersion}/${url}` });
      },
      Post<A>(url: string, data?: any, config?: AxiosRequestConfig): Promise<A> {
        return requester<A>({
          ...config,
          method: "post",
          url: `${cfg.baseUrl}/${PublicOfferRoute}/${PublicOfferVersion}/${url}`,
          data
        });
      },
      Delete(url: string) {
        return requester<any>({
          method: "delete",
          url: `${cfg.baseUrl}/${PublicOfferRoute}/${PublicOfferVersion}/${url}`
        });
      },
      Put<A>(url: string, data?: any): Promise<A> {
        return requester<A>({
          method: "put",
          url: `${cfg.baseUrl}/${PublicOfferRoute}/${PublicOfferVersion}/${url}`,
          data
        });
      },
      Request: requester
    };
  }