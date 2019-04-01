import * as R from "ramda";
import { State, modify, gets, state } from "fp-ts/lib/State";
import { createDeferred, resolver } from "./ArtesianUtils";

export type BulkheadOptions = {
  parallelism: number;
};
export const defaultBulkheadOptions = {
  parallelism: 10
};
type statusType = { running: number; queue: resolver[] };
export function Bulkhead<Request, Response>(
  options: BulkheadOptions,
  service: (r?: Request) => Promise<Response>
) {
  let status: statusType = {
    running: 0,
    queue: []
  };
  const canRunRequest = gets(
    (s: statusType) => s.running < options.parallelism && s.queue.length > 0
  );

  const getRequestsToRun = WhileM(canRunRequest, pullFromQueue);

  function setUpRequest(promise: Promise<any>, request?: Request) {
    return promise
      .then(() => service(request))
      .then(
        res => {
          runRequests(decRunning.applySecond(getRequestsToRun));
          return res;
        },
        rej => {
          runRequests(decRunning.applySecond(getRequestsToRun));
          return Promise.reject(rej);
        }
      );
  }

  const runRequests = function(state: State<statusType, resolver[]>) {
    const [requests, newStatus] = state.run(status);
    status = newStatus;
    requests.forEach(f => f());
  };

  return function(request?: Request) {
    const [promise, resolver] = createDeferred();

    const wrappedRequest = setUpRequest(promise, request);
    runRequests(addToQueue(resolver).applySecond(getRequestsToRun));

    return wrappedRequest;
  };
}

const incRunning = modify<statusType>(s => R.evolve({ running: R.inc }, s));
const decRunning = modify<statusType>(s => R.evolve({ running: R.dec }, s));

const addToQueue = (res: resolver) =>
  modify<statusType>(R.evolve({ queue: x => R.append(res, x) }));

const pullFromQueue = gets<statusType, resolver>(
  R.pipe(
    R.prop("queue"),
    (x: any) => R.head(x) || (() => {})
  )
)
  .applyFirst(
    modify<statusType>(R.evolve({ queue: (xs: any[]) => R.tail(xs) }))
  )
  .applyFirst(incRunning);

function WhileM(
  predicateM: State<statusType, boolean>,
  actionM: State<statusType, resolver>
) {
  function loop(acc: resolver[]): State<statusType, resolver[]> {
    return predicateM.chain((p: boolean) =>
      p ? actionM.chain(x => loop([...acc, x])) : state.of(acc)
    );
  }
  return loop([]);
}
