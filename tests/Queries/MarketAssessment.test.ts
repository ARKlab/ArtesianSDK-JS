import * as moxios from "moxios";
import { QueryService } from "../../src";
import { getMoxiosUrl } from "../helpers";

const { RelativeIntervalType } = QueryService;

const cfg = {
  baseUrl: "https://fake-artesian-env/",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};
const qs = QueryService.FromApiKey(cfg);

describe("ActualQueries", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test("Extraction type", () =>
    qs
      .CreateMas()
      .ForFilterId(15)
      .ForProducts(["M+1", "M+2"])
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split(cfg.baseUrl)[1]
            .split("/")[0]
        ).toEqual("mas");
      }));
  test("Product Check", () =>
    qs
      .CreateMas()
      .ForFilterId(15)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(
        () => Promise.reject("This should fail Product check"),
        err => expect(err).toBe("Products are required")
      ));
  test("Product", () =>
    qs
      .CreateMas()
      .ForFilterId(15)
      .ForProducts(["M+1", "M+2"])
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(() =>
        expect(getMoxiosUrl().qs).toMatchObject({
          p: `${encodeURIComponent("M+1")},${encodeURIComponent("M+2")}`
        })
      ));
});
