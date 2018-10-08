import * as moxios from "moxios";
import { QueryService } from "../src";
import { getMoxiosUrl } from "./helpers";

const { Granularity, RelativeIntervalType, SystemTimeTransform } = QueryService;

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

  test("Granularity Check", () =>
    qs
      .CreateActual()
      .ForFilterId(15)
      // .InGranularity(Granularity.Day)
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute()
      .then(
        () => Promise.reject("This should fail Granularity check"),
        err => expect(err).toBe("Granularity is required")
      ));
  test("Curve Selection", () =>
    qs
      .CreateActual()
      // .ForFilterId(15)
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
      // .InRelativeInterval(RelativeIntervalType.RollingMonth)
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
        expect(getMoxiosUrl()).toStrictEqual({
          method: "get",
          url: `${cfg.baseUrl}ts/Day/RollingMonth`,
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
        expect(getMoxiosUrl()).toStrictEqual({
          method: "get",
          url: `${cfg.baseUrl}ts/Day/RollingMonth`,
          qs: { id: "100000001" }
        });
      }));
  test("ActInAbsoluteDateRangeExtractionWindow", () =>
    qs
      .CreateActual()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(getMoxiosUrl()).toStrictEqual({
          method: "get",
          url: `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10`,
          qs: { id: "100000001" }
        });
      }));
  // test("ActInRelativePeriodExtractionWindow", done => {
  //   qs.CreateActual()
  //   .ForMarketData([100000001] )
  //   .InGranularity(Granularity.Day)
  //   .InRelativePeriod(Period.FromDays(5))
  //   .Execute();

  //   moxios.wait(function() {
  //     expect(moxios.requests.first()).toStrictEqual({
  //       url:
  //         `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10?id=100000001`
  //     });
  //     done();
  //   });
  // });
  // test("ActInRelativePeriodRangeExtractionWindow", done => {
  //   qs.CreateActual()
  //   .ForMarketData([100000001] )
  //   .InGranularity(Granularity.Day)
  //   .InRelativePeriod(Period.FromDays(5))
  //   .Execute();

  //   moxios.wait(function() {
  //     expect(moxios.requests.first()).toStrictEqual({
  //       url:
  //         `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10?id=100000001`
  //     });
  //     done();
  //   });
  // });
  describe("ActWithTimeZone", () => {
    test("UTC", () =>
      qs
        .CreateActual()
        .ForMarketData([100000001])
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .InTimezone("UTC")
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toStrictEqual({
            method: "get",
            url: `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10`,
            qs: { tz: "UTC", id: "100000001" }
          });
        }));
    test("WET", () =>
      qs
        .CreateActual()
        .ForMarketData([100000001])
        .InGranularity(Granularity.Hour)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .InTimezone("WET")
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toStrictEqual({
            method: "get",
            url: `${cfg.baseUrl}ts/Hour/2018-01-01/2018-01-10`,
            qs: { tz: "WET", id: "100000001" }
          });
        }));
  });
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
          expect(getMoxiosUrl()).toStrictEqual({
            method: "get",
            url: `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10`,
            qs: { tr: "1", id: "100000001" }
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
          expect(getMoxiosUrl()).toStrictEqual({
            method: "get",
            url: `${cfg.baseUrl}ts/Day/2018-01-01/2018-01-10`,
            qs: { tr: "2", id: "100000001" }
          });
        }));
  });
});
