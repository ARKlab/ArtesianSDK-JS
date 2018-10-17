import * as moxios from "moxios";
import { QueryService } from "../../src";
import { getMoxiosUrl } from "../helpers";

const { Granularity, RelativeIntervalType } = QueryService;

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};
const qs = QueryService.FromApiKey(cfg);

describe("BaseQueries", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test("Curve Selection", () =>
    qs
      .CreateActual()
      .InGranularity(Granularity.Day)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(
        () => Promise.reject("This should fail Curve Selection check"),
        err => expect(err).toBe("Curve Selection is required")
      ));
  test("Extraction Range", () =>
    qs
      .CreateActual()
      .ForFilterId(15)
      .InGranularity(Granularity.Day)
      .Execute()
      .then(
        () => Promise.reject("This should fail Extraction Range check"),
        err => expect(err).toBe("Extraction Range is required")
      ));
  test("FilterId", () =>
    qs
      .CreateActual()
      .ForFilterId(15)
      .InGranularity(Granularity.Day)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(() => {
        expect(getMoxiosUrl()).toMatchObject({
          qs: { filterId: "15" }
        });
      }));
  test("ActInRelativeIntervalExtractionWindow", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("/")
            .slice(-1)[0]
        ).toEqual("RollingMonth");
      }));
  test("ActInAbsoluteDateRangeExtractionWindow", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("/")
            .slice(-2)
        ).toEqual(["2018-01-01", "2018-01-10"]);
      }));
  test("ActInRelativePeriodExtractionWindow", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InRelativePeriod("P5D")
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("/")
            .slice(-1)
        ).toEqual(["P5D"]);
      }));
  test("ActInRelativePeriodRangeExtractionWindow", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InRelativePeriodRange("P2W", "P20D")
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("/")
            .slice(-2)
        ).toEqual(["P2W", "P20D"]);
      }));
  test("ActWithTimeZone", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .InTimezone("UTC")
      .Execute()
      .then(() => {
        expect(getMoxiosUrl()).toMatchObject({
          qs: { tz: "UTC" }
        });
      }));
});
