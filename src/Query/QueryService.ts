import axios, { AxiosInstance, AxiosPromise } from "axios";
import {
  ArtesianServiceConfig,
  createApiKeyConfig,
  createAuthConfig
} from "./Data/ArtesianServiceConfig";
import { ActualQuery } from "./ActualQuery";
import * as VQ from "./VersionedQuery";
import { MasQuery } from "./MasQuery";
import { QueryRoute, QueryVersion } from "./Data/ArtesianConstants";

class QueryService {
  client: AxiosInstance;
  constructor(cfg: ArtesianServiceConfig) {
    function Get<A>(url: string): AxiosPromise<A> {
      switch (cfg.authType.tag) {
        case "ApiKeyConfig":
          return axios.get<A>(
            `${cfg.baseUrl}/${QueryRoute}/${QueryVersion}/${url}`,
            {
              headers: { "x-api-key": cfg.authType.val }
            }
          );
        case "Auth0Config":
          return axios
            .post(
              `https://${cfg.authType.domain}/oauth/token`,
              {
                client_id: cfg.authType.clientId,
                client_secret: cfg.authType.clientSecret,
                audience: cfg.authType.audience,
                grant_type: "client_credentials"
              },
              { headers: { "content-type": "application/json" } }
            )
            .then((res: { data: any }) => res.data)
            .then((data: { access_token: string }) => data.access_token)
            .then((token: string) =>
              axios.get<A>(
                `${cfg.baseUrl}/${QueryRoute}/${QueryVersion}/${url}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              )
            );
      }
    }
    this.client = axios.create({ baseURL: cfg.baseUrl });
    this.client.get = Get;
  }
  /**
   * Create Actual Time Serie Query
   */
  CreateActual() {
    return new ActualQuery(this.client);
  }
  /**
   * Create Versioned Time Serie Query
   */
  CreateVersioned() {
    return new VQ.VersionedQuery(this.client);
  }
  /**
   * Create Market Assessment Time Serie Query
   */
  CreateMas() {
    return new MasQuery(this.client);
  }
}
/**
 * Create an instance of QueryService using apikey config
 * @param cfg Provide an api key and base url for the service
 */
export function FromApiKey(cfg: { baseUrl: string; key: string }) {
  const queryConfig = cfg as Partial<{ baseUrl: string; key: string }>;
  if (typeof queryConfig.key == "undefined") throw "Must provide an api key";
  if (typeof queryConfig.baseUrl == "undefined")
    throw "Must provide a base Address to an Artesian tenant";

  return new QueryService(
    createApiKeyConfig({ baseUrl: queryConfig.baseUrl, key: queryConfig.key })
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
      clientSecret: queryConfig.clientSecret
    })
  );
}

export {
  Granularity,
  RelativeIntervalType,
  SystemTimeTransform
} from "./Data/Query";

export const VersionedQuery = VQ;
