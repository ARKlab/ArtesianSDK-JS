import * as Q from "./Query";
import {
  QueryParamsWithInterval,
  ExtractionRangeType,
  RelativeIntervalType
} from "./Data/Query";
import { IService } from "./QueryService";
import { IPartitionStrategy } from "./Partition/IdPartitionStrategy";

export class QueryWithExtractionInterval extends Q.Query{
  _queryParams: Partial<QueryParamsWithInterval> = {};
  constructor(
    public client: IService,
    public partitionStrategy: IPartitionStrategy,
  ) {
    super(client, partitionStrategy);
  }
  /**
   * Query by relative interval
   * @param interval the interval to query by
   */
  InRelativeInterval(interval: RelativeIntervalType) {
    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.RelativeInterval,
      Interval: interval
    };
    return this;
  }
}
/**
 * Validate the base query params
 * @param q query params object
 */
export function validateQuery(q: Partial<QueryParamsWithInterval>): Promise<QueryParamsWithInterval> {
  if (q.curveSelection == undefined)
    return Promise.reject("Curve Selection is required");
  if (q.extractionRange == undefined)
    return Promise.reject("Extraction Range is required");

  return Promise.resolve(q as QueryParamsWithInterval);
}

/**
 * Build the extraction url segment from query params
 * @param q query params object
 */
export function buildExtractionRangeRoute(q: QueryParamsWithInterval): string {
  switch (q.extractionRange.tag) {
    case ExtractionRangeType.DateRange:
      return (
        `${q.extractionRange.start.toISOString().split("T")[0]}/` +
        `${q.extractionRange.end.toISOString().split("T")[0]}`
      );
    case ExtractionRangeType.Period:
      return `${q.extractionRange.Period}`;
    case ExtractionRangeType.PeriodRange:
      return `${q.extractionRange.PeriodFrom}/${q.extractionRange.PeriodTo}`;
    case ExtractionRangeType.RelativeInterval:
      return `${RelativeIntervalType[q.extractionRange.Interval]}`;
  }
}
/**
 * Add the timezone query param to the url
 * @param q query params object
 */
export function getUrlQueryParams(q: QueryParamsWithInterval) {
  return q.tz ? "tz=" + q.tz : "";
}
