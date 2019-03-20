import * as R from "ramda";
import { put, gets } from "fp-ts/lib/State";
import { Either, right, left } from "fp-ts/lib/Either";

export type CircuitBreakerOptions = {
  maxBreakerFailures: number;
  resetTimeout: number;
  breakerDescription: string;
};

export const defaultCircuitBreakerOptions: CircuitBreakerOptions = {
  maxBreakerFailures: 3,
  resetTimeout: 60000,
  breakerDescription: "Circuit Breaker Open"
};

type CircuitBreakerStatus = CircuitBreakerOpen | CircuitBreakerClosed;

type CircuitBreakerOpen = {
  tag: "open";
  resetTime: number;
};
const openCircuit = (resetTime: number) =>
  put<CircuitBreakerStatus>({ tag: "open", resetTime });

type CircuitBreakerClosed = {
  tag: "closed";
  errors: number[];
};
const closeCircuit = put<CircuitBreakerStatus>({ tag: "closed", errors: [] });

export function CircuitBreaker<Request, Response>(
  options: CircuitBreakerOptions,
  service: (a?: Request) => Promise<Response>
) {
  let circuitStatus: CircuitBreakerStatus = { tag: "closed", errors: [] };

  async function canaryCall(request?: Request) {
    circuitStatus = openCircuit(Date.now() + options.resetTimeout).exec(
      circuitStatus
    );
    const result = await service(request);
    circuitStatus = closeCircuit.exec(circuitStatus);
    return result;
  }
  function callIfOpen(request?: Request) {
    switch (circuitStatus.tag) {
      case "closed":
        return Promise.reject(options.breakerDescription);
      case "open":
        return Date.now() > circuitStatus.resetTime
          ? canaryCall(request)
          : Promise.reject(options.breakerDescription);
    }
  }
  function incErrors() {
    switch (circuitStatus.tag) {
      case "open":
        break;
      case "closed":
        circuitStatus = addError(Date.now()).exec(circuitStatus);
    }
  }
  const callIfClosed = (request?: Request) =>
    onCatch(incErrors, service(request));

  return function breakerService(request?: Request): Promise<Response> {
    switch (circuitStatus.tag) {
      case "closed":
        return callIfClosed(request);
      case "open":
        return callIfOpen(request);
    }
  };

  function addError(time: number) {
    return gets(ifClosed).chain(x =>
      x
        .map(
          R.evolve({
            errors: R.pipe(
              R.dropWhile((e: number) => e < time - options.resetTimeout),
              R.append(time)
            )
          })
        )
        .fold(
          put,
          R.ifElse(
            x => x.errors.length >= options.maxBreakerFailures,
            () => openCircuit(time + options.resetTimeout),
            put
          )
        )
    );
  }
}

function onCatch<a>(action: () => void, prom: Promise<a>) {
  return prom.catch(e => {
    action();
    return Promise.reject(e);
  });
}
function ifClosed(
  status: CircuitBreakerStatus
): Either<CircuitBreakerStatus, CircuitBreakerClosed> {
  switch (status.tag) {
    case "closed":
      return right(status);

    default:
      return left(status);
  }
}
