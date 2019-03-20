import { createDeferred, resolver } from "./ArtesianUtils";
import { put, gets } from "fp-ts/lib/State";
import { Either, left, right } from "fp-ts/lib/Either";
import * as R from "ramda";

type cacheStatus = emptyCache | filledCache | requestInFlight;

type emptyCache = { tag: "empty" };
const emptyCache = put<cacheStatus>({ tag: "empty" });
type filledCache = { tag: "filled"; auth: Auth0CacheValue };
const fillCache = (auth: Auth0CacheValue) =>
  put<cacheStatus>({ tag: "filled", auth });

type requestInFlight = {
  tag: "inflight";
  queue: resolver[];
};
const startRequest = put<cacheStatus>({ tag: "inflight", queue: [] });

export type Auth0Response = {
  access_token: string;
  expires_in: number;
};
type Auth0CacheValue = {
  access_token: string;
  expires_at: number;
};
export function Auth0Cache<Request>(
  service: (r?: Request) => Promise<Auth0Response>
) {
  let status: cacheStatus = { tag: "empty" };

  function callIfFilled(request?: Request) {
    switch (status.tag) {
      case "filled":
        if (status.auth.expires_at > Date.now())
          return Promise.resolve(status.auth);
        status = emptyCache.exec(status);
        return callIfEmpty(request);
      default:
        return Promise.reject();
    }
  }
  function callIfInFlight(request?: Request) {
    switch (status.tag) {
      case "inflight":
        const [promise, resolve] = createDeferred();
        status = addToQueue(resolve).exec(status);
        return promise.then(() => callIfFilled(request));
      default:
        return Promise.reject();
    }
  }
  function callIfEmpty(request?: Request) {
    switch (status.tag) {
      case "empty":
        status = startRequest.exec(status);
        return service(request)
          .then(res => ({
            access_token: res.access_token,
            expires_at: Date.now() - 5000 + res.expires_in
          }))
          .then(cacheValue => {
            const [queued, newStatus] = successResolve(cacheValue).run(status);
            status = newStatus;
            queued.forEach(f => f());
            return cacheValue;
          })
          .catch(rej => {
            const [queued, newStatus] = failResolve.run(status);
            status = newStatus;
            queued.forEach(f => f());
            return Promise.reject(rej);
          });
      default:
        return Promise.reject();
    }
  }
  return function(request?: Request): Promise<Auth0CacheValue> {
    switch (status.tag) {
      case "filled":
        return callIfFilled(request);
      case "inflight":
        return callIfInFlight(request);
      case "empty":
        return callIfEmpty(request);
    }
  };
}
const isInFlight = (x: cacheStatus): Either<cacheStatus, requestInFlight> => {
  switch (x.tag) {
    case "inflight":
      return right(x);
    default:
      return left(x);
  }
};
const addToQueue = (a: resolver) =>
  gets(isInFlight).chain(x =>
    x.map(R.evolve({ queue: z => R.append(a, z) })).fold(put, put)
  );

const getQueueItems = gets(isInFlight).map(x =>
  x.fold(R.always([]), R.prop("queue"))
);
const successResolve = (auth: Auth0CacheValue) =>
  getQueueItems.applyFirst(fillCache(auth));

const failResolve = getQueueItems.applyFirst(emptyCache);
