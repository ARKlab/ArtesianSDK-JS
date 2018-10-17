import * as moxios from "moxios";
import { QueryService } from "../../src";
import { getMoxiosUrl } from "../helpers";

const { Granularity, RelativeIntervalType, SystemTimeTransform } = QueryService;

const cfg = {
  baseUrl: "https://fake-artesian-env",
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
  test("Granularity Check", () =>
    qs
      .CreateActual()
      .ForFilterId(15)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(
        () => Promise.reject("This should fail Granularity check"),
        err => expect(err).toBe("Granularity is required")
      ));
  test("Extraction type", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split(cfg.baseUrl)[1]
            .split("/")[3]
        ).toEqual("ts");
      }));
  test("Granularity", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("ts/")[1]
            .split("/")[0]
        ).toEqual("Day");
      }));
  describe("ActWithTimeTransfrom", () => {
    test("1", () =>
      qs
        .CreateActual()
        .ForMarketData([100000001])
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithTimeTransform(1)
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { tr: "1" }
          });
        }));
    test("Thermal", () =>
      qs
        .CreateActual()
        .ForMarketData([100000001])
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { tr: "2" }
          });
        }));
  });
});
