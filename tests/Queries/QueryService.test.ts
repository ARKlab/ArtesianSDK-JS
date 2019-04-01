import { QueryService } from "../../src";
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";

describe("QueryService", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test("FromApiKey", () => {
    moxios.stubRequest(/.*/, { response: [] });
    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz"
    });
    return qs.client.get("fake").then(() => {
      expect(getMoxiosUrl().headers).toMatchObject({ "x-api-key": "lulz" });
    });
  });
  test("FromAuthConfig", () => {
    moxios.stubRequest(/.*/, { response: { access_token: "lolz" } });

    const qs = QueryService.FromAuthConfig({
      baseUrl: "fake",
      clientId: "id",
      clientSecret: "sec",
      audience: "aud",
      domain: "do"
    });
    return qs.client.get("fake").then(() => {
      expect(JSON.parse(moxios.requests.first().config.data)).toMatchObject({
        client_id: "id",
        client_secret: "sec",
        audience: "aud",
        grant_type: "client_credentials"
      });
      expect(moxios.requests.mostRecent().config.headers).toMatchObject({
        Authorization: "Bearer lolz"
      });
    });
  });
  test("TestUrlBase", () => {
    moxios.stubRequest(/.*/, { response: [] });
    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz"
    });
    return qs.client.get("fake").then(() => {
      expect(getMoxiosUrl().headers).toMatchObject({ "x-api-key": "lulz" });
    });
  });
  test("Has Retry Success", async () => {
    moxios.uninstall();
    moxios.install();
    moxios.stubRequest(/.*/, {
      response: [{ message: "lel" }]
    });
    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz",
      retryOptions: { delayRate: 1, times: 3 }
    });
    await qs.client.get("fake");
    expect(moxios.requests.count()).toEqual(1);
  });
  test("Has Retry Fail", async () => {
    moxios.uninstall();
    moxios.install();
    moxios.stubRequest(/.*/, {
      status: 422,
      statusText: "no good",
      response: { message: "lel" }
    });
    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz",
      retryOptions: { delayRate: 1, times: 3 }
    });
    await qs.client.get("fake").catch(x => x);
    expect(moxios.requests.count()).toEqual(4);
  });
  test("Has Circuit Breaker", async () => {
    moxios.uninstall();
    moxios.install();
    moxios.stubRequest(/.*/, {
      status: 422,
      statusText: "no good",
      response: { message: "lel" }
    });

    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz",
      retryOptions: { delayRate: 1, times: 3 }
    });
    await expect(
      qs.client.get("fake").catch(x => {
        throw x.response.statusText;
      })
    ).rejects.toEqual("no good");
    await expect(
      qs.client.get("fake").catch(x => {
        throw x.response.statusText;
      })
    ).rejects.toEqual("no good");
    await expect(
      qs.client.get("fake").catch(x => {
        throw x.response.statusText;
      })
    ).rejects.toEqual("no good");
    await expect(qs.client.get("fake")).rejects.toEqual("Circuit Breaker Open");
  });
  test("Has Bulkhead", () => {
    // todo test bulkhead is used
  });
  test("Allow User to specify an execution strategy", async () => {
    moxios.uninstall();
    moxios.install();
    moxios.stubRequest(/.*/, {
      status: 422,
      statusText: "no good",
      response: { message: "lel" }
    });

    const qs = QueryService.FromApiKey({
      baseUrl: "fake",
      key: "lulz",
      executionStrategy: x => x
    });
    await expect(
      qs.client.get("fake").catch(x => {
        throw x.response.statusText;
      })
    ).rejects.toEqual("no good");
    expect(moxios.requests.count()).toEqual(1);
  });
});
