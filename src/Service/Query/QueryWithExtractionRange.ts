import * as Q from "./Query";
import {
  ExtractionRangeType,
  QueryParamsWithRange
} from "./Data/Query";
import { IService } from "./QueryService";
import { IPartitionStrategy } from "./Partition/IdPartitionStrategy";

export class QueryWithExtractionRange extends Q.Query{
  _queryParams: Partial<QueryParamsWithRange> = {};
  constructor(
    public client: IService,
    public partitionStrategy: IPartitionStrategy
  ) {
    super(client,partitionStrategy);
  }
}
/**
 * Validate the base query params
 * @param q query params object
 */
export function validateQuery(q: Partial<QueryParamsWithRange>): Promise<QueryParamsWithRange> {
  if (q.curveSelection == undefined)
    return Promise.reject("Curve Selection is required");
  if (q.extractionRange == undefined)
    return Promise.reject("Extraction Range is required");

  return Promise.resolve(q as QueryParamsWithRange);
}

/**
 * Build the extraction url segment from query params
 * @param q query params object
 */
export function buildExtractionRangeRoute(q: QueryParamsWithRange): string {
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
  }
}
/**
 * Add the timezone query param to the url
 * @param q query params object
 */
export function getUrlQueryParams(q: QueryParamsWithRange) {
  return q.tz ? "tz=" + q.tz : "";
}