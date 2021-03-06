![image](https://www.ark-energy.eu/wp-content/uploads/ark-dark.png)

# Artesian.SDK

[![npm version](https://badge.fury.io/js/artesian-sdk.svg)](https://badge.fury.io/js/artesian-sdk)

This Library provides read access to the Artesian API

## Getting Started

### Installation

This library is provided by npm.

```
npm install artesian-sdk --save
```

## How to use

An Artesian QueryService can be created using either API-Key or Client credentials authentication

## QueryService

Using the QueryService we create Actual, Versioned and Market Assessment time series queries. A QueryService can be created using either the `FromApiKey` or `FromAuthConfig` methods

```javascript
import { QueryService } from "artesian-sdk";

//API-Key
qs = QueryService.FromApiKey({
  baseUrl: "https://fake-artesian-env/",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6",
});

//Client credentials
qs = QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
});
```

## Actual Time Series

```javascript
import { QueryService } from "artesian-sdk";

const { Granularity } = QueryService;

actualTimeSeriesQuery = qs
  .CreateVersioned()
  .ForMarketData([100000001, 100000002, 100000003])
  .InGranularity(Granularity.Day)
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"));
```

To construct an Actual Time Series the following must be provided.

| Actual Query           | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| Curve Selection        | A [curve selection](#curve-selection)                                       |
| Time Granularity       | The granularity type (invoke the InGranularity method)                      |
| Time Extraction Window | An [extraction time window](#time-extraction-window) for data to be queried |

## Versioned Time Series

```javascript
import { QueryService } from "artesian-sdk";

const { Granularity } = QueryService;

versionedTimeSeriesQuery = qs
  .CreateVersioned()
  .ForMarketData([100000001])
  .InGranularity(Granularity.Day)
  .ForLastNVersions(1)
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"));
```

To construct an Actual Time Series the following must be provided.

| Versioned Query                  | Description                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| Curve Selection                  | A [curve selection](#curve-selection)                                       |
| Time Granularity                 | The granularity type (invoke the InGranularity method)                      |
| Time Extraction Window           | An [extraction time window](#time-extraction-window) for data to be queried |
| Versioned Time Extraction Window | A [versioned time extraction window](#versioned-time-extraction-window)     |

## Market Assessment Time Series

```javascript
import { QueryService } from "artesian-sdk";

const { Granularity, RelativeIntervalType } = QueryService;

marketAssessmentTimeSeriesQuery = qs
  .CreateMas()
  .ForFilterId(15)
  .ForProducts(["M+1", "M+2"])
  .InRelativeInterval(RelativeIntervalType.RollingMonth);
```

To construct a Market assessment the following must be provided.

| Versioned Query        | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| Curve Selection        | A [curve selection](#curve-selection)                                       |
| Product                | An array of Products                                                        |
| Time Extraction Window | An [extraction time window](#time-extraction-window) for data to be queried |

## Auction Time Series

```javascript
import { QueryService } from "artesian-sdk";

qs.CreateAuction()
  .ForMarketData([100000001])
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
  .Execute();
```

To construct an Auction Time Series the following must be provided.

| Auction Query          | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| Curve Selection        | A [curve selection](#curve-selection)                                       |
| Time Extraction Window | An [extraction time window](#time-extraction-window) for data to be queried |

## Bid Ask Time Series

```javascript
import { QueryService } from "artesian-sdk";

const { Granularity, RelativeIntervalType } = QueryService;

marketAssessmentTimeSeriesQuery = qs
  .CreateBidAsk()
  .ForFilterId(15)
  .ForProducts(["M+1", "M+2"])
  .InRelativeInterval(RelativeIntervalType.RollingMonth);
```

To construct a Bid Ask the following must be provided.

| Versioned Query        | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| Curve Selection        | A [curve selection](#curve-selection)                                       |
| Product                | An array of Products                                                        |
| Time Extraction Window | An [extraction time window](#time-extraction-window) for data to be queried |

## Running a Query

To run a query on an artesian tenant invoke the `Execute` method on a query. This will return a Promise that will contain the results of the query or an error in the case of a badly formed query.

```javascript
actualTimeSeriesQuery = qs
  .CreateVersioned()
  .ForMarketData([100000001, 100000002, 100000003])
  .InGranularity(Granularity.Day)
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
  .Execute();
```

## Curve Selection

A Curve Selection must be added to every Query. To add a curve selection invoke either the `ForMarketData` or `ForFilterId` methods on a query.

```javascript
// MarketIds
qs.CreateActual().ForMarketData([100000001]);

// FilterId
qs.CreateActual().ForFilterId(15);
```

## Time Extraction Window

An Extraction Window must be added to every query. To add an extraction use one of the methods below.
(Note [this section](#period) decsribes how to create a period string)

```javascript
import { QueryService } from "artesian-sdk";

const { RelativeIntervalType } = QueryService;

// Date Range
qs.CreateActual().InAbsoluteDateRange(
  new Date("2018-1-1"),
  new Date("2018-1-10")
);

// Relative Interval
qs.CreateActual().InRelativeInterval(RelativeIntervalType.RollingMonth);

// Period
qs.CreateActual().InRelativePeriod("P5D");

// Period Range
qs.CreateActual().InRelativePeriodRange("P2W", "P20D");
```

## Versioned Time Extraction Window

A Versioned Time Extraction must be added to Versioned Queries. Use one of the methods below to add one.
(Note creating a version extraction for `ForLastOfDays` and `ForLastOfMonths` is descibed in the [next section](#version-extraction))

```javascript
import { QueryService } from "artesian-sdk";

const { VersionedQuery } = QueryService;

// Extract the last N number of versions
qs.CreateVersioned().ForLastNVersions(1);

// Extract the most updated version
qs.CreateVersioned().ForMuv();

// Extract a specific version
qs.CreateVersioned().ForVersion(new Date("2018-1-1"));

// Extract the last version of day in the Version Extraction
qs.CreateVersioned().ForLastOfDays(
  VersionedQuery.inDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
);

// Extract the last version of month in the Version Extraction
qs.CreateVersioned().ForLastOfMonths(
  VersionedQuery.inDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
);
```

## Version Extraction

A Version Extraction can be created using the following functions.
(Note [this section](#period) describes how to create a period string)

```javascript
import { QueryService } from "artesian-sdk";

const { VersionedQuery } = QueryService;

/**
 * Create a version extraction range with dates
 * @param {Date} start date of version range
 * @param {Date} end date of version range
 */
VersionedQuery.inDateRange(new Date("2018-1-1"), new Date("2018-1-10"));

/**
 * Create a version extraction range with a period
 * @param {String} period of the version range
 */
VersionedQuery.inPeriod("P5D");

/**
 * Create a version extraction range with a start and an end period
 * @param {String} start of period range
 * @param {String} end of period range
 */
VersionedQuery.inPeriodRange("P5D", "P10D");
```

## Period

A period string duration can be create as described by [this section](https://en.wikipedia.org/wiki/ISO_8601#Durations) in wikipedia.
Other recommended libraries to build a period string are:

- [luxon](https://moment.github.io/luxon/index.html)
- [moment.js](http://momentjs.com/)

### Filler Strategy

All extraction types (Actual,Versioned, Market Assessment and BidAsk) have an optional filler strategy.

```javascript
var versionedSeries = await qs        
  .CreateVersioned()
  .ForMarketData([100000001])
  .ForLastNVersions(1)
  .InGranularity(Granularity.Day)
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
  .WithFillLatestValue("P5D")
  .Execute()
```

Null

```javascript
 .WithFillNull()
```

None

```javascript
 .WithFillNone()
```

Custom Value

```javascript
 //Timeseries
 .WithFillCustomValue(123)
 // Market Assessment
 .WithFillCustomValue({
    settlement: 123,
    open: 456,
    close: 789,
    high: 321,
    low: 654,
    volumePaid: 987,
    volueGiven: 213,
    volume: 435,
  })
```

Latest Value

```javascript
 .WithLFillLatestValue("P5D")
```


## MarketData Service

Using the ArtesianServiceConfig `cfg` we create an instance of the MarketDataService which is used to retrieve and edit
MarketData refrences. `getMarketReference` will read the marketdata entity by marketDataIdentifier, curve provider and curve name.

```javascript
import { MarketDataService } from "artesian-sdk";

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6",
};

const marketDataService = MarketDataService.FromApiKey(cfg);

const marketData = marketDataService.MarketDataServiceExtensions.getMarketDataReference(
  {
    provider: marketDataEntity.ProviderName,
    name: marketDataEntity.MarketDataName,
  }
);
```

To Check MarketData for `isRegistered` status, returns true if present or false if not found.

```javascript
var isRegistered = await marketData.isRegistered();
```

A new curve can be registered using the `Register` method and providing metadata as input.

```javascript
/*
type Input = {
  MarketDataId?: number;
  ETag?: string;
  ProviderName: string;
  MarketDataName: string;
  OriginalGranularity: Granularity;
  Type: MarketDataType;
  OriginalTimezone: string;
  AggregationRule: AggregationRule;
  TransformId?: number;
  ProviderDescription?: string;
  Tags?: Record<string, string[]>;
  Path?: string;
};
*/

await marketData.Register(marketDataEntity);
```

Calling `Load`, retrieves the current metadata of a MarketData.

```javascript
await marketData.Load();
```

Using `Write mode` to edit MarketData and `save` to save the data of the current MarketData providing an instant.

### Actual Time Series

`EditActual` starts the write mode for an Actual Time serie. Checks are done to verify registration and MarketDataType to verify it is an Actual Time Serie.
Using `AddData` to be written.

```javascript
var writeMarketData = marketdata.EditActual();

writeMarketData.AddData(new Date("2020-01-01"), 10);
writeMarketData.AddData(new Date("2020-01-02"), 15);

await writeMarketData.Save(new Date());
```

### Versioned Time Series

`EditVersioned` starts the write mode for a Versioned Time serie. Checks are done to verify registration and MarketDataType to verify it is a Versioned Time Serie.
Using `AddData` to be written.

```javascript
var writeMarketData = marketData.EditVersioned(new Date("2020-01-01"));

writeMarketData.AddData(new Date("2020-01-01"), 10);
writeMarketData.AddData(new Date("2020-01-02"), 15);

await writeMarketData.Save(new Date());
```

### Market Assessment Time Series

`EditMarketAssessment` starts the write mode for a Market Assessment. Checks are done to verify registration and MarketDataType to verify it is a Market Assessment.
Using `AddData` to provide a local date time and a MarketAssessmentValue to be written.

```javascript
var writeMarketData = marketData.EditMarketAssessment();

type marketAssessmentValue = {
  settlement?: number,
  open?: number,
  close?: number,
  high?: number,
  low?: number,
  volumePaid?: number,
  volueGiven?: number,
  volume?: number,
};

writeMarketData.AddData(
  new Date("2020-01-01"),
  "Dec-20",
  marketAssessmentValue
);

await writeMarketData.Save(new Date());
```

### Auction Time Series

`editAuction` starts the write mode for a Auction. Checks are done to verify registration and MarketDataType to verify it is a Auction curve.
Using `AddData` to provide a date and Auction bid and offer arrays to be written.

```javascript
var writeMarketData = marketData.editAuction(marketData);

writeMarketData.AddData(
  new Date("2020-01-01"),
  [{ price: 100, quantity: 10 }],
  [{ price: 120, quantity: 12 }]
);
writeMarketData.AddData(
  new Date("2020-01-02"),
  [{ price: 100, quantity: 10 }],
  [{ price: 120, quantity: 12 }]
);

await writeMarketData.Save(getUTCDate(new Date()));
```

### Bid Ask Time Series

`EditBidAsk` starts the write mode for a Bid Ask. Checks are done to verify registration and MarketDataType to verify it is a Bid Ask.
Using `AddData` to provide a local date time and a BidAskValue to be written.

```javascript
var writeMarketData = marketData.EditBidAsk();

type bidAskValue = {
  bestBidPrice?: number;
  bestAskPrice?: number;
  bestBidQuantity?: number;
  bestAskQuantity?: number;
  lastPrice?: number;
  lastQuantity?: number;
};

writeMarketData.AddData(
  new Date("2020-01-01"),
  "Dec-20",
  bidAskValue
);

await writeMarketData.Save(new Date());
```

## Advanced Configuration

Both the `FromApiKey` and `FromAuthConfig` QueryService methods take advanced configuration options

### Query Partition Strategy

When large amounts of data need to be requested from the service a partitioning strategy can help make the requests more reliable and faster. A default partitioning strategy is built into the sdk. It will partition queries based on the curve ids selected and split into batches of 25 and accumulate the results. The batch size can be specified with an optional configuration field `queryOptions`

```javascript
QueryService.FromApiKey({
  baseUrl: string,
  key: string,
  queryOptions: { partitionSize: 25 },
});

QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
  queryOptions: { partitionSize: 25 },
});
```

### Custom Query Partition Strategy

It is possible to define your own custom partition strategy it must subscibe to the interface `IPartitionStrategy` and can be configured with an optional configuration field `paritionStrategy`

```typescript
interface IPartitionStrategy {
  Actual: (a: ActualQueryParams[]) => ActualQueryParams[];
  Versioned: (a: VersionedQueryParams[]) => VersionedQueryParams[];
  Mas: (a: MasQueryParams[]) => MasQueryParams[];
}

const doNothingStrategy = {
  Actual: (x) => x,
  Versioned: (x) => x,
  Mas: (x) => x,
};

const qs = QueryService.FromApiKey({
  baseUrl: string,
  key: string,
  paritionStrategy: doNothingStrategy,
});

QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
  paritionStrategy: doNothingStrategy,
});
```

### Retry Request Execution Strategy

Sometimes requests will fail spontaneously but will work if simply executed again in a few moments. In order to reduce these kinds of errors in the sdk there is a built in retry strategy. The request will retry 3 times with an increasing length of time between requests. The retry strategy can be configured with an optional configuration field `retryOptions`

```javascript
QueryService.FromApiKey({
  baseUrl: string,
  key: string,
  retryOptions: {
    times: 3,
    delayRate: 1000,
  },
});

QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
  retryOptions: {
    times: 3,
    delayRate: 1000,
  },
});
```

### Circuit Breaker Request Execution Strategy

Sometimes a service will go down for a period of time and a request to it will always fail. In order to reduce these kinds of errors in the sdk there is a built in circuit breaker strategy. If a req fails 3 times in a minute the next request and subsequent request will automatically fail. the circuit breaker will do a test request after 1 minute and allow requests through if it succeeds. The circuit breaker strategy can be configured with an optional configuration field `circuitBreakerOptions`

```javascript
QueryService.FromApiKey({
  baseUrl: string,
  key: string,
  circuitBreakerOptions: {
    maxBreakerFailures: 3,
    resetTimeout: 60000,
    breakerDescription: "Circuit Breaker Open",
  },
});

QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
  circuitBreakerOptions: {
    maxBreakerFailures: 3,
    resetTimeout: 60000,
    breakerDescription: "Circuit Breaker Open",
  },
});
```

### Bulkhead Request Execution Strategy

Too many request to the server at once put it extra load and may result in failures. In order to reduce these kinds of errors in the sdk there is a built in bulkhead strategy. The bulkhead strategy will limit the number if requests in flight to 10 and will queue further requests, once a request finishes a request will be dequeued. The bulkhead strategy can be configured with an optional configuration field `bulkheadOptions`

```javascript
QueryService.FromApiKey({
  baseUrl: string,
  key: string,
  bulkheadOptions: {
    parallelism: 10,
  },
});

QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret",
  bulkheadOptions: {
    parallelism: 10,
  },
});
```

## Links

- [Github](https://github.com/ARKlab/ArtesianSDK-JS)
- [Ark Energy](http://www.ark-energy.eu/)
