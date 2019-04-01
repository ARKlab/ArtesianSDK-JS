import * as R from "ramda";
import { Bulkhead, defaultBulkheadOptions, BulkheadOptions } from "./Bulkhead";
import {
  CircuitBreaker,
  defaultCircuitBreakerOptions,
  CircuitBreakerOptions
} from "./CircuitBreaker";
import { Retry, defaultRetryOptions, RetryOptions } from "./Retry";

export type requester = <Request, Response>(r: Request) => Promise<Response>;
export function CreateWrapper(cfg: {
  bulkheadOptions?: BulkheadOptions;
  circuitBreakerOptions?: CircuitBreakerOptions;
  retryOptions?: RetryOptions;
}): (x: requester) => requester {
  return R.compose<any, any, any, any>(
    (x: requester) =>
      Bulkhead(cfg.bulkheadOptions || defaultBulkheadOptions, x),
    (x: requester) =>
      CircuitBreaker(
        cfg.circuitBreakerOptions || defaultCircuitBreakerOptions,
        x
      ),
    (x: requester) => Retry(cfg.retryOptions || defaultRetryOptions, x)
  );
}
