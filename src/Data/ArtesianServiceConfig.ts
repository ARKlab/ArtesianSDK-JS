export type ArtesianServiceConfig = {
  baseUrl: string;
  authType: ApiKeyConfig | Auth0Config;
};

export function createApiKeyConfig(cfg: {
  baseUrl: string;
  key: string;
}): ArtesianServiceConfig {
  return {
    baseUrl: cfg.baseUrl,
    authType: { tag: "ApiKeyConfig", val: cfg.key }
  };
}
export function createAuthConfig(cfg: {
  baseUrl: string;
  audience: string;
  domain: string;
  clientId: string;
  clientSecret: string;
}): ArtesianServiceConfig {
  return {
    baseUrl: cfg.baseUrl,
    authType: {
      tag: "Auth0Config",
      audience: cfg.audience,
      domain: cfg.domain,
      clientId: cfg.clientId,
      clientSecret: cfg.clientSecret
    }
  };
}
export type ApiKeyConfig = {
  tag: "ApiKeyConfig";
  val: string;
};

export type Auth0Config = {
  tag: "Auth0Config";
  audience: string;
  domain: string;
  clientId: string;
  clientSecret: string;
};
