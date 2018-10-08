import {
  QueryParams,
  CurveSelectionType,
  ExtractionRangeType,
  RelativeIntervalType
} from "./Data/Query";
import { AxiosInstance } from "axios";

function validateQuery(q: Partial<QueryParams>): Promise<QueryParams> {
  if (q.curveSelection == undefined)
    return Promise.reject("Curve Selection is required");
  if (q.extractionRange == undefined)
    return Promise.reject("Extraction Range is required");

  return Promise.resolve(q as QueryParams);
}

export class Query {
  client: AxiosInstance;
  _queryParams: Partial<QueryParams> = {};
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  ForMarketData(ids: number[]) {
    this._queryParams.curveSelection = {
      tag: CurveSelectionType.IdSelection,
      val: ids
    };
    return this;
  }
  ForFilterId(id: number) {
    this._queryParams.curveSelection = {
      tag: CurveSelectionType.FilterSelection,
      val: id
    };
    return this;
  }
  InTimezone(tz: string) {
    this._queryParams.tz = tz;
    return this;
  }
  InAbsoluteDateRange(start: Date, end: Date) {
    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.DateRange,
      Start: start,
      End: end
    };
    return this;
  }
  InRelativeInterval(int: RelativeIntervalType) {
    this._queryParams.extractionRange = {
      tag: ExtractionRangeType.RelativeInterval,
      Interval: int
    };
    return this;
  }
  validateQuery(): Promise<QueryParams> {
    return validateQuery(this._queryParams);
  }
  buildExtractionRangeRoute(q: QueryParams): string {
    switch (q.extractionRange.tag) {
      case ExtractionRangeType.DateRange:
        return `${q.extractionRange.Start.toISOString().split("T")[0]}/${
          q.extractionRange.End.toISOString().split("T")[0]
        }`;
      case ExtractionRangeType.Period:
        return `${q.extractionRange.Period}`;
      case ExtractionRangeType.PeriodRange:
        return `${q.extractionRange.PeriodFrom}/${q.extractionRange.PeriodTo}`;
      case ExtractionRangeType.RelativeInterval:
        return `${RelativeIntervalType[q.extractionRange.Interval]}`;
    }
  }
  getUrlQueryParams(q: QueryParams) {
    return q.tz ? "tz=" + q.tz : "";
  }
}
