import { getUTCDate } from "./../../src/Common/ArtesianUtils";
import {
  Input,
  Output
} from "./../../src/Service/MarketData/Data/MarketDataEntity";
import {
  TransformDefinitionType,
  TransformType,
  MarketDataType,
  AggregationRule
} from "../../src/Service/MarketData/Data/MarketDataEntity";
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";
import { Granularity } from "../../src/Data/Enums";
import { MarketDataService } from "../../src";

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};

const mds = MarketDataService.FromApiKey(cfg);

//#region MarketData Service

test("MarketData Factory actual time series", async () => {
  moxios.uninstall();
  moxios.install();
  let x: Output = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketDataName",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.ActualTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.AverageAndReplicate,
    Transform: {
      id: 1,
      name: "TimeTName",
      eTag: "00000000-0000-0000-0000-000000000000",
      definedBy: TransformDefinitionType.System,
      type: TransformType.SimpleShift
    },
    LastUpdated: new Date(),
    Created: new Date()
  };

  moxios.stubRequest(/.*/, { response: x });
  var marketDataEntity: Input = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketData",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.ActualTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined
  };

  var marketData = mds.MarketDataServiceExtensions.getMarketDataReference({
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName
  });

  await marketData.Register(marketDataEntity);

  var RegisterMarketData = await marketData.isRegistered();
  expect(RegisterMarketData).toBe(true);

  marketData.metaData.aggregationRule = AggregationRule.SumAndDivide;

  await marketData.update();
  await marketData.load();

  expect(marketData.metaData.aggregationRule).toBe(
    AggregationRule.SumAndDivide
  );

  var writeMarketData = marketData.editActual(marketData);

  writeMarketData.AddData(new Date(2018, 10, 3), 10);
  writeMarketData.AddData(new Date(2018, 10, 4), 15);

  await writeMarketData.Save(getUTCDate(new Date()));

  expect(
    getMoxiosUrl()
      .url.split("/")
      .slice(-2)
  ).toEqual(["marketdata", "entity"]);
  expect(getMoxiosUrl().method).toEqual("post");
});

test("MarketData Factory auction time series", async () => {
  moxios.uninstall();
  moxios.install();
  let x: Output = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketDataName",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.AuctionTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.AverageAndReplicate,
    Transform: {
      id: 1,
      name: "TimeTName",
      eTag: "00000000-0000-0000-0000-000000000000",
      definedBy: TransformDefinitionType.System,
      type: TransformType.SimpleShift
    },
    LastUpdated: new Date(),
    Created: new Date()
  };

  moxios.stubRequest(/.*/, { response: x });
  var marketDataEntity: Input = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketData",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.AuctionTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined
  };

  var marketData = mds.MarketDataServiceExtensions.getMarketDataReference({
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName
  });

  await marketData.Register(marketDataEntity);

  var RegisterMarketData = await marketData.isRegistered();
  expect(RegisterMarketData).toBe(true);

  marketData.metaData.aggregationRule = AggregationRule.SumAndDivide;

  await marketData.update();
  await marketData.load();

  expect(marketData.metaData.aggregationRule).toBe(
    AggregationRule.SumAndDivide
  );

  var writeMarketData = marketData.editAuction(marketData);
  
  writeMarketData.AddData(new Date(2018, 10, 3), [{price: 100, quantity: 10}], [{price: 120, quantity: 12}]);
  writeMarketData.AddData(new Date(2018, 10, 4), [{price: 100, quantity: 10}], [{price: 120, quantity: 12}]);

  await writeMarketData.Save(getUTCDate(new Date()));

  expect(
    getMoxiosUrl()
      .url.split("/")
      .slice(-2)
  ).toEqual(["marketdata", "entity"]);
  expect(getMoxiosUrl().method).toEqual("post");
});

test("MarketData Factory versioned time series", async () => {
  const mds = MarketDataService.FromApiKey(cfg);

  moxios.uninstall();
  moxios.install();
  let x: Output = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketDataName",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.VersionedTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.AverageAndReplicate,
    Transform: {
      id: 1,
      name: "TimeTName",
      eTag: "00000000-0000-0000-0000-000000000000",
      definedBy: TransformDefinitionType.System,
      type: TransformType.SimpleShift
    },
    LastUpdated: new Date(),
    Created: new Date()
  };

  moxios.stubRequest(/.*/, { response: x });

  var marketDataEntity: Input = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketData",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.VersionedTimeSerie,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined
  };
  var marketData = mds.MarketDataServiceExtensions.getMarketDataReference({
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName
  });

  await marketData.Register(marketDataEntity);

  var RegisterMarketData = await marketData.isRegistered();
  expect(RegisterMarketData).toBe(true);

  marketData.metaData.aggregationRule = AggregationRule.SumAndDivide;

  await marketData.update();
  await marketData.load();

  expect(marketData.metaData.aggregationRule).toBe(
    AggregationRule.SumAndDivide
  );

  var writeMarketData = marketData.editVersioned(
    marketData,
    new Date(2018, 10, 18, 0, 0)
  );

  writeMarketData.AddData(new Date(2018, 10, 3), 10);
  writeMarketData.AddData(new Date(2018, 10, 4), 15);

  await writeMarketData.Save(getUTCDate(new Date()));

  expect(
    getMoxiosUrl()
      .url.split("/")
      .slice(-2)
  ).toEqual(["marketdata", "entity"]);
  expect(getMoxiosUrl().method).toEqual("post");
});

test("MarketData Factory Market Assessment", async () => {
  const mds = MarketDataService.FromApiKey(cfg);

  moxios.uninstall();
  moxios.install();
  let x: Output = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketDataName",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.MarketAssessment,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined,
    Transform: {
      id: 1,
      name: "TimeTName",
      eTag: "00000000-0000-0000-0000-000000000000",
      definedBy: TransformDefinitionType.System,
      type: TransformType.SimpleShift
    },
    LastUpdated: new Date(),
    Created: new Date()
  };

  moxios.stubRequest(/.*/, { response: x });

  var marketDataEntity: Input = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketData",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.MarketAssessment,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined
  };
  var marketData = mds.MarketDataServiceExtensions.getMarketDataReference({
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName
  });

  await marketData.Register(marketDataEntity);

  var RegisterMarketData = await marketData.isRegistered();
  expect(RegisterMarketData).toBe(true);

  await marketData.update();

  await marketData.load();

  expect(marketData.metaData.aggregationRule).toBe(AggregationRule.Undefined);

  var writeMarketData = marketData.editMarketAssessment(marketData);

  var marketAssessmentValue = {
    high: 47,
    close: 20,
    low: 18,
    open: 33,
    settlement: 22
  };

  writeMarketData.AddData(
    new Date(2018, 11, 28),
    "Dec-18",
    marketAssessmentValue
  );
  await writeMarketData.Save(getUTCDate(new Date()));
  expect(
    getMoxiosUrl()
      .url.split("/")
      .slice(-2)
  ).toEqual(["marketdata", "entity"]);
  expect(getMoxiosUrl().method).toEqual("post");
});

test("MarketData Factory Bid Ask", async () => {
  const mds = MarketDataService.FromApiKey(cfg);

  moxios.uninstall();
  moxios.install();
  let x: Output = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketDataName",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.BidAsk,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined,
    Transform: {
      id: 1,
      name: "TimeTName",
      eTag: "00000000-0000-0000-0000-000000000000",
      definedBy: TransformDefinitionType.System,
      type: TransformType.SimpleShift
    },
    LastUpdated: new Date(),
    Created: new Date()
  };

  moxios.stubRequest(/.*/, { response: x });

  var marketDataEntity: Input = {
    MarketDataId: 0,
    ProviderName: "TestProvider",
    MarketDataName: "TestMarketData",
    OriginalGranularity: Granularity.Day,
    Type: MarketDataType.BidAsk,
    OriginalTimezone: "CET",
    AggregationRule: AggregationRule.Undefined
  };
  var marketData = mds.MarketDataServiceExtensions.getMarketDataReference({
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName
  });

  await marketData.Register(marketDataEntity);

  var RegisterMarketData = await marketData.isRegistered();
  expect(RegisterMarketData).toBe(true);

  await marketData.update();

  await marketData.load();

  expect(marketData.metaData.aggregationRule).toBe(AggregationRule.Undefined);

  var writeMarketData = marketData.editBidAsk(marketData);

  var bidAskValue = {
    bestBidPrice: 47,
    bestAskPrice: 35,
    bestBidQuantity: 41,
    bestAskQuantity: 16,
    lastPrice: 23,
    lastQuantity: 78
  };

  writeMarketData.AddData(
    new Date(2018, 11, 28),
    "Dec-18",
    bidAskValue
  );
  await writeMarketData.Save(getUTCDate(new Date()));
  expect(
    getMoxiosUrl()
      .url.split("/")
      .slice(-2)
  ).toEqual(["marketdata", "entity"]);
  expect(getMoxiosUrl().method).toEqual("post");
});

//#endregion
