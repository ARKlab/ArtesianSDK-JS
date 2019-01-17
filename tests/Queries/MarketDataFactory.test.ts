import { getUTCDate } from './../../src/Common/ArtesianUtils';
import { Input, Output } from './../../src/Service/MarketData/Data/MarketDataEntity';
import { TransformDefinitionType, TransformType, MarketDataType, AggregationRule } from '../../src/Service/MarketData/Data/MarketDataEntity';
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";
import { Granularity } from '../../src/Data/Enums';
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
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketDataName',
        originalGranularity: Granularity.Day,
        type: MarketDataType.ActualTimeSerie,
        originalTimezone: 'CET',
        aggregationRule: AggregationRule.AverageAndReplicate,
        transform: {
            id: 1,
            name: "TimeTName",
            eTag: "00000000-0000-0000-0000-000000000000",
            definedBy: TransformDefinitionType.System,
            type: TransformType.SimpleShift
        },
        lastUpdated: new Date(),
        created: new Date()
    };

    moxios.stubRequest(/.*/, { response: { data: x } });
    var marketDataEntity: Input = {
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketData',
        originalGranularity: Granularity.Day,
        type: MarketDataType.ActualTimeSerie,
        originalTimezone: "CET",
        aggregationRule: AggregationRule.Undefined
    }

    var marketData = mds.MarketDataServiceExtensions.getMarketDataReference(mds, { provider: marketDataEntity.providerName, name: marketDataEntity.marketDataName })
    var RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(false);

    await marketData.Register(marketDataEntity);

    RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(true);

    marketData.metaData.aggregationRule = AggregationRule.SumAndDivide;
    
    await marketData.update();
    await marketData.load();

    expect(marketData.metaData.aggregationRule).toBe(AggregationRule.SumAndDivide);

    var writeMarketData = marketData.editActual(marketData);

    writeMarketData.AddData(new Date(2018, 10, 3), 10);
    writeMarketData.AddData(new Date(2018, 10, 4), 15);

    await writeMarketData.Save(getUTCDate(new Date()));

    expect(getMoxiosUrl().url.split("/")
    .slice(-2)
    ).toEqual(["marketdata", "entity"])
    expect(getMoxiosUrl().method)
    .toEqual("get")

}
)

test("MarketData Factory versioned time series", async () => {
    moxios.uninstall();
    moxios.install();
    let x: Output = {
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketDataName',
        originalGranularity: Granularity.Day,
        type: MarketDataType.VersionedTimeSerie,
        originalTimezone: 'CET',
        aggregationRule: AggregationRule.AverageAndReplicate,
        transform: {
            id: 1,
            name: "TimeTName",
            eTag: "00000000-0000-0000-0000-000000000000",
            definedBy: TransformDefinitionType.System,
            type: TransformType.SimpleShift
        },
        lastUpdated: new Date(),
        created: new Date()
    };

    moxios.stubRequest(/.*/, { response: { data: x } });

    var marketDataEntity: Input = {
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketData',
        originalGranularity: Granularity.Day,
        type: MarketDataType.VersionedTimeSerie,
        originalTimezone: "CET",
        aggregationRule: AggregationRule.Undefined
    }
    var marketData = mds.MarketDataServiceExtensions.getMarketDataReference(mds, { provider: marketDataEntity.providerName, name: marketDataEntity.marketDataName })
    var RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(false);

    await marketData.Register(marketDataEntity);

    RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(true);

    marketData.metaData.aggregationRule = AggregationRule.SumAndDivide;
    
    await marketData.update();
    await marketData.load();

    expect(marketData.metaData.aggregationRule).toBe(AggregationRule.SumAndDivide);

    var writeMarketData = marketData.editVersioned(marketData,new Date(2018, 10, 18, 0, 0));

    writeMarketData.AddData(new Date(2018, 10, 3), 10);
    writeMarketData.AddData(new Date(2018, 10, 4), 15);

    await writeMarketData.Save(getUTCDate(new Date()));

    expect(getMoxiosUrl().url.split("/")
    .slice(-2)
    ).toEqual(["marketdata", "entity"])
    expect(getMoxiosUrl().method)
    .toEqual("get")

}
)

test("MarketData Factory Market Assessment", async () => {
    moxios.uninstall();
    moxios.install();
    let x: Output = {
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketDataName',
        originalGranularity: Granularity.Day,
        type: MarketDataType.MarketAssessment,
        originalTimezone: 'CET',
        aggregationRule: AggregationRule.Undefined,
        transform: {
            id: 1,
            name: "TimeTName",
            eTag: "00000000-0000-0000-0000-000000000000",
            definedBy: TransformDefinitionType.System,
            type: TransformType.SimpleShift
        },
        lastUpdated: new Date(),
        created: new Date()
    };

    moxios.stubRequest(/.*/, { response: { data: x } });

    var marketDataEntity: Input = {
        marketDataId: 0,
        providerName: 'TestProvider',
        marketDataName: 'TestMarketData',
        originalGranularity: Granularity.Day,
        type: MarketDataType.MarketAssessment,
        originalTimezone: "CET",
        aggregationRule: AggregationRule.Undefined
    }
    var marketData = mds.MarketDataServiceExtensions.getMarketDataReference(mds, { provider: marketDataEntity.providerName, name: marketDataEntity.marketDataName })
    var RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(false);

    await marketData.Register(marketDataEntity);

    RegisterMarketData = marketData.isRegistered();
    expect(RegisterMarketData).toBe(true);
    
    await marketData.update();
    await marketData.load();

    expect(marketData.metaData.aggregationRule).toBe(AggregationRule.Undefined);

    var writeMarketData = marketData.editMarketAssessment(marketData);

    var marketAssessmentValue = {
        high : 47,
        close : 20,
        low : 18,
        open : 33,
        settlement : 22
    }

    writeMarketData.AddData(new Date(2018,11,28),"Dec-18",marketAssessmentValue);
    
    await writeMarketData.Save(getUTCDate(new Date()));

    expect(getMoxiosUrl().url.split("/")
    .slice(-2)
    ).toEqual(["marketdata", "entity"])
    expect(getMoxiosUrl().method)
    .toEqual("get")

}
)

//#endregion