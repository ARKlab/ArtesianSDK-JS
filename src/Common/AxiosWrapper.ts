import * as R from "ramda";
import { ArtesianServiceConfig } from "../Data/ArtesianServiceConfig";
import axios, { AxiosRequestConfig } from "axios";
import { CreateWrapper } from "./ApiResilienceStrategy";
import { Auth0Service } from "./Auth0Service";
import { Auth0Cache } from "./Auth0Cache";

export function axiosWrapper(
  cfg: ArtesianServiceConfig
): <A>(r: AxiosRequestConfig) => Promise<A> {
  const wrapper = cfg.executionStrategy || CreateWrapper(cfg);
  const getHeaders = GetHeaders(cfg);
  async function Request<A>(config: AxiosRequestConfig) {
    const headers = await getHeaders();

    return axios
      .request<A>(
        R.mergeDeepRight(
          {
            headers: { "user-agent": "ArtesianSDK-JS v0.0.6" }
          },
          {
            ...config,
            ...headers
          }
        )
      )
      .then(x => x.data);
  }
  return wrapper(Request);
}

function GetHeaders(
  cfg: ArtesianServiceConfig
): () => Promise<{ headers: any }> {
  switch (cfg.authType.tag) {
    case "ApiKeyConfig":
      const authType = cfg.authType;
      return () =>
        Promise.resolve({
          headers: { "x-api-key": authType.val }
        });

    case "Auth0Config":
      const auth = cfg.authType;
      const cachedService = Auth0Cache(Auth0Service);

      return () =>
        cachedService(auth)
          .then((data: { access_token: string }) => data.access_token)
          .then((token: string) => ({
            headers: { Authorization: `Bearer ${token}` }
          }));
  }
}
