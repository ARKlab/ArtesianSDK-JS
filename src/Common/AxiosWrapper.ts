import * as R from "ramda";
import { ArtesianServiceConfig } from "../Data/ArtesianServiceConfig";
import axios, { AxiosRequestConfig } from "axios";
import { CreateWrapper } from "./ApiResilienceStrategy";
import { Auth0Service } from "./Auth0Service";
import { Auth0Cache } from "./Auth0Cache";

function runtimeCheck() {
  const platform = require('platform');
  if ( typeof self === 'undefined'){
    // Node
    return `Node:${process.version}`;
  } else if (platform.name) {
    // Browser
    return `${platform.name}:${platform.version}`;
  } else {
    return `Unknown`;
  }
}

export function axiosWrapper(
  cfg: ArtesianServiceConfig
): <A>(r: AxiosRequestConfig) => Promise<A> {
  const wrapper = cfg.executionStrategy || CreateWrapper(cfg);
    const getAuthHeaders = GetAuthHeaders(cfg);
    async function Request<A>(config: AxiosRequestConfig) {
    const authHeaders = await getAuthHeaders();
    
    const os = require('os');
    const runtime = runtimeCheck();

    return axios
      .request<A>(
        R.mergeDeepRight(
          {
                headers: { "X-Artesian-Agent": `ArtesianSDK-JS:${process.env.npm_package_version},${os.type()+"-"+os.arch()}:${os.release()},${runtime}`}
          },
          {
            ...config,
            ...authHeaders
          }
        )
      )
      .then(x => x.data);
  }
  return wrapper(Request);
}

function GetAuthHeaders(
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
