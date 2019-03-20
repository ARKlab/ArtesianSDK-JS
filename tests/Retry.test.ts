import { Retry, defaultRetryOptions } from "../src/Common/Retry";
import moxios = require("moxios");

describe("Retry", () => {
  test("Service passes through success", async () => {
    const service = () => Promise.resolve("we good");
    const retry = Retry(defaultRetryOptions, service);

    await expect(retry(1)).resolves.toEqual("we good");
    expect(moxios.requests.count() == 1);
  });
  test("Service passes through fails", () => {
    const service = () => Promise.reject("oh noooes");
    const retry = Retry({ ...defaultRetryOptions, delayRate: 1 }, service);

    return expect(retry(1)).rejects.toEqual("oh noooes");
  });
  test("Retries the correct number of times", async () => {
    const service = jest.fn(() => Promise.reject("oh noooes"));
    const retry = Retry({ times: 3, delayRate: 1 }, service);

    await retry(1).catch(() => {});
    return expect(service).toBeCalledTimes(4);
  });
});
