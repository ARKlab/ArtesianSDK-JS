export type QueryParams = {
  extractionRange: ExtractionRange;
  curveSelection: CurveSelection;
  tz?: string;
};
export function getCurveSelectionParams(q: QueryParams): string {
  switch (q.curveSelection.tag) {
    case CurveSelectionType.IdSelection:
      return "id=" + q.curveSelection.val.join(",");
    case CurveSelectionType.FilterSelection:
      return "filterId=" + q.curveSelection.val.toString();
  }
}
export type ActualQueryParams = QueryParams & {
  granularity: Granularity;
  tr?: number;
};

export type VersionedQueryParams = QueryParams & {
  granularity: Granularity;
  tr?: number;
  versionSelection: VersionSelection;
};

export function addTimeTransformQueryParam(q: { tr?: number }): string {
  return q.tr ? "tr=" + q.tr.toString() : "";
}

export type MasQueryParams = QueryParams & {
  products: string[];
};

export type VersionSelection =
  | LastN
  | MUV
  | LastOfDays
  | LastOfMonths
  | Version;
export type LastN = { tag: VersionSelectionType.LastN; val: number };
export type MUV = { tag: VersionSelectionType.MUV };
export type LastOfDays = {
  tag: VersionSelectionType.LastOfDays;
  start: Date;
  end: Date;
};
export type LastOfMonths = {
  tag: VersionSelectionType.LastOfMonths;
  start: Date;
  end: Date;
};
export type Version = { tag: VersionSelectionType.Version; val: Date };
export enum VersionSelectionType {
  LastN,
  MUV,
  LastOfDays,
  LastOfMonths,
  Version
}
export type CurveSelection = IdSelection | FilterSelection;

export type IdSelection = {
  tag: CurveSelectionType.IdSelection;
  val: number[];
};
export type FilterSelection = {
  tag: CurveSelectionType.FilterSelection;
  val: number;
};
export enum CurveSelectionType {
  IdSelection,
  FilterSelection
}

export type ExtractionRange =
  | DateRange
  | Period
  | PeriodRange
  | RelativeInterval;

export type DateRange = {
  tag: ExtractionRangeType.DateRange;
  Start: Date;
  End: Date;
};
export type Period = {
  tag: ExtractionRangeType.Period;
  Period: Date;
};
export type PeriodRange = {
  tag: ExtractionRangeType.PeriodRange;
  PeriodFrom: Date;
  PeriodTo: Date;
};
export type RelativeInterval = {
  tag: ExtractionRangeType.RelativeInterval;
  Interval: RelativeIntervalType;
};
export enum ExtractionRangeType {
  DateRange,
  Period,
  PeriodRange,
  RelativeInterval
}
export enum RelativeIntervalType {
  RollingWeek,
  RollingMonth,
  RollingQuarter,
  RollingYear,
  WeekToDate,
  MonthToDate,
  QuarterToDate,
  YearToDate
}
export enum Granularity {
  Hour,
  Day,
  Week,
  Month,
  Quarter,
  Year,
  TenMinute,
  FifteenMinute,
  Minute,
  ThirtyMinute
}
