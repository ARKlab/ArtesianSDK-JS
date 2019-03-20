import { RetryOptions } from "../Common/Retry";
import { CircuitBreakerOptions } from "../Common/CircuitBreaker";
import { BulkheadOptions } from "../Common/Bulkhead";
import { requester } from "../Common/ApiResilienceStrategy";

export type ArtesianServiceConfig = {
  baseUrl: string;
  queryOptions?: queryOptions;
  retryOptions?: RetryOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  bulkheadOptions?: BulkheadOptions;
  executionStrategy?: (r: requester) => requester;
  authType: ApiKeyConfig | Auth0Config;
};

export function createApiKeyConfig(cfg: {
  baseUrl: string;
  key: string;
  queryOptions?: queryOptions;
  retryOptions?: RetryOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  bulkheadOptions?: BulkheadOptions;
  executionStrategy?: (r: requester) => requester;
}): ArtesianServiceConfig {
  return {
    baseUrl: cfg.baseUrl,
    authType: { tag: "ApiKeyConfig", val: cfg.key },
    queryOptions: cfg.queryOptions,
    retryOptions: cfg.retryOptions,
    circuitBreakerOptions: cfg.circuitBreakerOptions,
    bulkheadOptions: cfg.bulkheadOptions,
    executionStrategy: cfg.executionStrategy
  };
}
export function createAuthConfig(cfg: {
  baseUrl: string;
  audience: string;
  domain: string;
  clientId: string;
  clientSecret: string;
  queryOptions?: queryOptions;
  retryOptions?: RetryOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  bulkheadOptions?: BulkheadOptions;
  executionStrategy?: (r: requester) => requester;
}): ArtesianServiceConfig {
  return {
    baseUrl: cfg.baseUrl,
    authType: {
      tag: "Auth0Config",
      audience: cfg.audience,
      domain: cfg.domain,
      clientId: cfg.clientId,
      clientSecret: cfg.clientSecret
    },
    queryOptions: cfg.queryOptions,
    retryOptions: cfg.retryOptions,
    circuitBreakerOptions: cfg.circuitBreakerOptions,
    bulkheadOptions: cfg.bulkheadOptions,
    executionStrategy: cfg.executionStrategy
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

export type queryOptions = {
  partitionSize: number;
};
