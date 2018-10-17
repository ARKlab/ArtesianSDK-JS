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
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
});

//Client credentials
qs = QueryService.FromAuthConfig({
  baseUrl: "https://fake-artesian-env/",
  audience: "audience",
  domain: "domain",
  clientId: "client_id",
  clientSecret: "client_secret"
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

To construct an Actual Time Series the following must be provided.

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

## Links

- [Github](https://github.com/ARKlab/ArtesianSDK-JS)
- [Ark Energy](http://www.ark-energy.eu/)
