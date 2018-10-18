import { QueryService } from "../../src";
import moxios = require("moxios");
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
});
