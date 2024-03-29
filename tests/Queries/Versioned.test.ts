import * as moxios from "moxios";
import { QueryService } from "../../src";
import { getMoxiosUrl } from "../helpers";

const {
  Granularity,
  RelativeIntervalType,
  SystemTimeTransform,
  VersionedQuery
} = QueryService;

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};
const qs = QueryService.FromApiKey(cfg);

describe("VersionedQueries", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test("Extraction type", () =>
    qs
      .CreateVersioned()
      .ForMarketData([100000001])
      .InGranularity(Granularity.Day)
      .ForLastNVersions(1)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split(cfg.baseUrl)[1]
            .split("/")[3]
        ).toEqual("vts");
      }));
  test("Granularity", () =>
    qs
      .CreateVersioned()
      .ForMarketData([100000001])
      .ForLastNVersions(1)
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .Execute()
      .then(() => {
        expect(
          getMoxiosUrl()
            .url.split("Last1/")[1]
            .split("/")[0]
        ).toEqual("Day");
      }));
  describe("ActWithTimeTransfrom", () => {
    test("1", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
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
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
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
  describe("Version Select", () => {
    test("Version Select Check", () =>
      qs
        .CreateVersioned()
        .InGranularity(Granularity.Day)
        .ForFilterId(15)
        .InRelativeInterval(RelativeIntervalType.RollingMonth)
        .Execute()
        .then(
          () => Promise.reject("This should fail Version Select Check"),
          err => expect(err).toBe("Version Selection is required")
        ));
    test("Last", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
        .Execute()
        .then(() => {
          expect(
            getMoxiosUrl()
              .url.split("vts/")[1]
              .split("/")[0]
          ).toEqual("Last1");
        }));
    test("MUV", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForMuv()
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
        .Execute()
        .then(() => {
          expect(
            getMoxiosUrl()
              .url.split("vts/")[1]
              .split("/")[0]
          ).toEqual("MUV");
        }));
    test("Version", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForVersion(new Date("2018-1-1"))
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
        .Execute()
        .then(() => {
          expect(
            getMoxiosUrl()
              .url.split("vts/")[1]
              .split("/")
              .slice(0, 2)
          ).toEqual(["Version", "2018-01-01T00:00:00"]);
        }));
    describe("LastOf", () => {
      describe("Days", () => {
        test("DateRange", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfDays(
              VersionedQuery.inDateRange(
                new Date("2018-1-1"),
                new Date("2018-1-10")
              )
            )
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 3)
              ).toEqual(["LastOfDays", "2018-01-01", "2018-01-10"]);
            }));
        test("Period", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfDays(VersionedQuery.inPeriod("P5D"))
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 2)
              ).toEqual(["LastOfDays", "P5D"]);
            }));
        test("PeriodRange", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfDays(VersionedQuery.inPeriodRange("P5D", "P10D"))
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 3)
              ).toEqual(["LastOfDays", "P5D", "P10D"]);
            }));
      });
      describe("Months", () => {
        test("DateRange", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfMonths(
              VersionedQuery.inDateRange(
                new Date("2018-1-1"),
                new Date("2018-1-10")
              )
            )
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 3)
              ).toEqual(["LastOfMonths", "2018-01-01", "2018-01-10"]);
            }));

        test("Period", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfMonths(VersionedQuery.inPeriod("P5D"))
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 2)
              ).toEqual(["LastOfMonths", "P5D"]);
            }));
        test("PeriodRange", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForLastOfMonths(VersionedQuery.inPeriodRange("P-2M", "P5D"))
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 3)
              ).toEqual(["LastOfMonths", "P-2M", "P5D"]);
            }));
      });
    });
    describe("ForMostRecent", () => {   //Add ForMostRecent Tests here.....
      test("DateRange", () =>
        qs
          .CreateVersioned()
          .ForMarketData([100000001])
          .ForMostRecent(
            VersionedQuery.inDateRange(
              new Date("2018-1-1"),
              new Date("2018-1-10")
            )
          )
          .InGranularity(Granularity.Day)
          .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
          .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
          .Execute()
          .then(() => {
            expect(
              getMoxiosUrl()
                .url.split("vts/")[1]
                .split("/")
                .slice(0, 3)
            ).toEqual(["2018-01-01T00:00:00", "2018-01-10T00:00:00", "Day"]);
          }));
          test("DateTimeRange", () =>
          qs
            .CreateVersioned()
            .ForMarketData([100000001])
            .ForMostRecent(
              VersionedQuery.inDateRange(
                new Date("2018-01-01T12:30:00"),
                new Date("2018-01-10T18:15:30")
              )
            )
            .InGranularity(Granularity.Day)
            .InAbsoluteDateRange(new Date("2018-01-01T12:30:00"), new Date("2018-01-10T18:15:30"))
            .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
            .Execute()
            .then(() => {
              expect(
                getMoxiosUrl()
                  .url.split("vts/")[1]
                  .split("/")
                  .slice(0, 3)
              ).toEqual(["2018-01-01T12:30:00", "2018-01-10T18:15:30", "Day"]);
            }));
        test("Period", () =>
        qs
          .CreateVersioned()
          .ForMarketData([100000001])
          .ForMostRecent(VersionedQuery.inPeriod("P5D"))
          .InGranularity(Granularity.Day)
          .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
          .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
          .Execute()
          .then(() => {
            expect(
              getMoxiosUrl()
                .url.split("vts/")[1]
                .split("/")
                .slice(0, 2)
            ).toEqual(["P5D", "Day"]);
          }));
      test("PeriodRange", () =>
        qs
          .CreateVersioned()
          .ForMarketData([100000001])
          .ForMostRecent(VersionedQuery.inPeriodRange("P5D", "P10D"))
          .InGranularity(Granularity.Day)
          .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
          .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
          .Execute()
          .then(() => {
            expect(
              getMoxiosUrl()
                .url.split("vts/")[1]
                .split("/")
                .slice(0, 3)
            ).toEqual(["P5D", "P10D", "Day"]);
          }));
    });
  });
  describe("Fills", () => {
    test("Null Fill", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithFillNull()
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { fillerK: "Null" },
          });
        }));
    test("No Fill", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithFillNone()
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { fillerK: "NoFill" },
          });
        }));
    test("LatestValidValue", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithFillLatestValue("D-1")
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { fillerK: "LatestValidValue", fillerP: "D-1" },
          });
        }));
    test("CustomValue", () =>
      qs
        .CreateVersioned()
        .ForMarketData([100000001])
        .ForLastNVersions(1)
        .InGranularity(Granularity.Day)
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithFillCustomValue(10)
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: { fillerK: "CustomValue", fillerDV: "10" },
          });
        }));
  });
  test("Partitions Queries", async () => {
    const qs = QueryService.FromApiKey({
      baseUrl: "lel",
      key: "hehe",
      queryOptions: { partitionSize: 1 }
    });

    await qs
      .CreateVersioned()
      .ForMarketData([100000001, 100])
      .ForLastOfMonths(VersionedQuery.inPeriodRange("P-2M", "P5D"))
      .InGranularity(Granularity.Day)
      .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
      .WithTimeTransform(SystemTimeTransform.THERMALYEAR)
      .Execute();
    expect(moxios.requests.count()).toEqual(2);
  });
});
