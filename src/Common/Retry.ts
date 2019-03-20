export type RetryOptions = { times: number; delayRate: number };
export const defaultRetryOptions: RetryOptions = {
  times: 3,
  delayRate: 1000
};

export function Retry<Request, Response>(
  options: RetryOptions,
  service: (r?: Request) => Promise<Response>
) {
  function loop(count: number, request?: Request): Promise<Response> {
    if (count > 0)
      return service(request).catch(() =>
        timer((options.times + 1 - count) * options.delayRate).then(() =>
          loop(count - 1, request)
        )
      );
    return service(request);
  }
  return function(request?: Request) {
    return loop(options.times, request);
  };
}

function timer(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
