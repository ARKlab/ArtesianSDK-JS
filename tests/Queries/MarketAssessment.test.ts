import * as moxios from "moxios";
import { QueryService } from "../../src";
import { getMoxiosUrl } from "../helpers";

const { RelativeIntervalType } = QueryService;

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
            .split("/")[3]
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
  describe("Fills", () => {
    test("Null Fill", () =>
      qs
        .CreateMas()
        .ForMarketData([100000001])
        .ForProducts(["M+1", "M+2"])
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
        .CreateMas()
        .ForMarketData([100000001])
        .ForProducts(["M+1", "M+2"])
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
        .CreateMas()
        .ForMarketData([100000001])
        .ForProducts(["M+1", "M+2"])
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
        .CreateMas()
        .ForMarketData([100000001])
        .ForProducts(["M+1", "M+2"])
        .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
        .WithFillCustomValue({
          settlement: 1,
          open: 2,
          close: 3,
          high: 4,
          low: 5,
          volumePaid: 6,
          volueGiven: 7,
          volume: 8,
        })
        .Execute()
        .then(() => {
          expect(getMoxiosUrl()).toMatchObject({
            qs: {
              fillerK: "CustomValue",
              fillerDVs: "1",
              fillerDVo: "2",
              fillerDVc: "3",
              fillerDVh: "4",
              fillerDVl: "5",
              fillerDVvp: "6",
              fillerDVvg: "7",
              fillerDVvt: "8",
            },
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
      .CreateMas()
      .ForMarketData([1, 2])
      .ForProducts(["M+1", "M+2"])
      .InRelativeInterval(RelativeIntervalType.RollingMonth)
      .Execute();
    expect(moxios.requests.count()).toEqual(2);
  });
});
