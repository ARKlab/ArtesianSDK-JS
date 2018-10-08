import axios, { AxiosInstance, AxiosPromise } from "axios";
import {
  ArtesianServiceConfig,
  createApiKeyConfig,
  createAuth0Config
} from "./Data/ArtesianServiceConfig";
import { ActualQuery } from "./ActualQuery";
import { VersionedQuery } from "./VersionedQuery";
import { MasQuery } from "./MasQuery";

class QueryService {
  client: AxiosInstance;
  constructor(cfg: ArtesianServiceConfig) {
    function Get<A>(url: string): AxiosPromise<A> {
      switch (cfg.authType.tag) {
        case "ApiKeyConfig":
          return axios.get<A>(cfg.baseUrl + url, {
            headers: { "x-api-key": cfg.authType.val }
          });
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
              axios.get<A>(cfg.baseUrl + url, {
                headers: `Bearer ${token}`
              })
            );
      }
    }
    this.client = axios.create({ baseURL: cfg.baseUrl });
    this.client.get = Get;
  }

  CreateActual() {
    return new ActualQuery(this.client);
  }
  CreateVersioned() {
    return new VersionedQuery(this.client);
  }
  CreateMas() {
    return new MasQuery(this.client);
  }
}

export function FromApiKey(cfg: { baseUrl: string; key: string }) {
  return new QueryService(createApiKeyConfig(cfg));
}
export function FromAuth0Config(cfg: {
  baseUrl: string;
  audience: string;
  domain: string;
  clientId: string;
  clientSecret: string;
}) {
  return new QueryService(createAuth0Config(cfg));
}

export { Granularity, RelativeIntervalType, SystemTimeTransform } from "./Data/Query";
