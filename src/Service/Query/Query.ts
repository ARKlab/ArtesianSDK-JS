import {
  QueryParamsWithInterval,
  CurveSelectionType,
  ExtractionRangeType,
  RelativeIntervalType
} from "./Data/Query";
import { IService } from "./QueryService";
import { IPartitionStrategy } from "./Partition/IdPartitionStrategy";

export class Query {
  _queryParams: Partial<QueryParamsWithInterval> = {};
  constructor(
    public client: IService,
    public partitionStrategy: IPartitionStrategy
  ) {}
  /**
   * Set the market ids to be queried
   * @param ids
   */
  ForMarketData(ids: number[]) {
    this._queryParams.curveSelection = {
      tag: CurveSelectionType.IdSelection,
      val: ids
    };
    return this;
  }
  /**
   * Set the filter id to be queried
   * @param id The filter id to be queried
   */
  ForFilterId(id: number) {
    this._queryParams.curveSelection = {
      tag: CurveSelectionType.FilterSelection,
      val: id
    };
    return this;
  }
  /**
   * Set the timezone to be queried
   * @param tz
   */
  InTimezone(tz: string) {
    this._queryParams.tz = tz;
    return this;
  }
  /**
   * Query by absolute range
   * @param start start date
   * @param end end date
   */
  InAbsoluteDateRange(start: Date, end: Date) {
    if(start >= end)
      throw new Error("End date must be greater than start date");

    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.DateRange,
      start: start,
      end: end
    };
    return this;
  }
  /**
   * Query by relative period range
   * @param from period start
   * @param to period end
   */
  InRelativePeriodRange(from: string, to: string) {
    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.PeriodRange,
      PeriodFrom: from,
      PeriodTo: to
    };
    return this;
  }
  /**
   * Query by relative period
   * @param extractionPeriod
   */
  InRelativePeriod(extractionPeriod: string) {
    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.Period,
      Period: extractionPeriod
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
