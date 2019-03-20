import { Auth0Cache } from "../src/Common/Auth0Cache";

describe("Auth0Cache", () => {
  test("calls service once", async () => {
    const service = jest.fn(() =>
      Promise.resolve({ access_token: "", expires_in: 10000 })
    );
    const cached = Auth0Cache(service);

    await Promise.all([cached(1), cached(2)]);
    return expect(service).toBeCalledTimes(1);
  });
  test("calls service again after expiry - 5 seconds", async () => {
    const service = jest.fn(() =>
      Promise.resolve({ access_token: "", expires_in: 5000 })
    );
    const cached = Auth0Cache(service);

    await cached(1);
    await cached(2);
    return expect(service).toBeCalledTimes(2);
  });
});
