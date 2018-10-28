import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ArtesianServiceConfig,
  createApiKeyConfig,
  createAuthConfig,
  Auth0Config
} from "../Data/ArtesianServiceConfig";
import { MetadataVersion } from "../Data/Constants";
import { Acl } from "./Acl";
import { Admin } from "./Admin";
import { ApiKey as ApiKeySdk } from "./ApiKey";
import { CustomFilterSDK } from "./CustomFilter";
import { MarketData } from "./MarketData";
import { Operations } from "./Operations";
import { SearchFacet } from "./SearchFacet";
import { TimeTransformSDK } from "./TimeTransform";
import { UpsertCurve } from "./UpsertCurve";

class MetadataService {
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

  constructor(cfg: ArtesianServiceConfig) {
    const { Get, Post, Delete, Put } = addAuthentication(cfg);
    this.client = axios.create({ baseURL: cfg.baseUrl });
    this.client.get = Get;
    this.client.post = Post;
    this.client.delete = Delete;
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

  return new MetadataService(
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

  return new MetadataService(
    createAuthConfig({
      baseUrl: queryConfig.baseUrl,
      audience: queryConfig.audience,
      domain: queryConfig.domain,
      clientId: queryConfig.clientId,
      clientSecret: queryConfig.clientSecret
    })
  );
}

function addAuthentication(cfg: ArtesianServiceConfig) {
  let auth: Auth = { cfg };
  return {
    async Get<A>(url: string): Promise<A> {
      const [newAuth, header] = await getHeaders(auth);
      auth = newAuth;

      return axios
        .get<A>(`${cfg.baseUrl}/${MetadataVersion}/${url}`, {
          headers: header
        })
        .then(x => x.data);
    },
    async Post<A>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<A> {
      const [newAuth, header] = await getHeaders(auth);
      auth = newAuth;

      return axios
        .post<A>(`${cfg.baseUrl}/${MetadataVersion}/${url}`, data, {
          ...config,
          headers: header
        })
        .then(x => x.data);
    },
    async Delete(url: string) {
      const [newAuth, header] = await getHeaders(auth);
      auth = newAuth;

      return axios
        .delete(`${cfg.baseUrl}/${MetadataVersion}/${url}`, { headers: header })
        .then(x => x.data);
    },
    async Put<A>(url: string, data?: any) {
      const [newAuth, header] = await getHeaders(auth);
      auth = newAuth;

      return axios
        .put<A>(`${cfg.baseUrl}/${MetadataVersion}/${url}`, data, {
          headers: header
        })
        .then(x => x.data);
    }
  };
}
type Auth = {
  token?: string;
  cfg: ArtesianServiceConfig;
};
type AuthHeaders = Bearer | ApiKey;
type Bearer = { authorization: string };
type ApiKey = { "x-api-key": string };

async function ensureToken(auth: Auth0Config, token?: string): Promise<string> {
  if (token) return token;

  return axios
    .post(
      `https://${auth.domain}/oauth/token`,
      {
        client_id: auth.clientId,
        client_secret: auth.clientSecret,
        audience: auth.audience,
        grant_type: "client_credentials"
      },
      { headers: { "content-type": "application/json" } }
    )
    .then(res => res.data)
    .then(data => data.access_token);
}
async function getHeaders(auth: Auth): Promise<[Auth, AuthHeaders]> {
  switch (auth.cfg.authType.tag) {
    case "ApiKeyConfig":
      return [auth, { "x-api-key": auth.cfg.authType.val }];
    case "Auth0Config":
      const token = await ensureToken(auth.cfg.authType, auth.token);
      return [{ ...auth, token }, { authorization: `Bearer ${auth.token}` }];
  }
}
// class Auth {
//   token?: string;
//   cfg: ArtesianServiceConfig;
//   constructor(cfg: ArtesianServiceConfig) {
//     this.cfg = cfg;
//   }
//   getToken
// }
