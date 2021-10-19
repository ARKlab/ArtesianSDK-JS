import * as R from "ramda";
import * as Q from "./QueryWithExtractionInterval";
import {
  VersionedQueryParams,
  VersionSelectionType,
  getCurveSelectionParamsWithInterval,
  addTimeTransformQueryParam,
  LastOfType,
  ExtractionRangeType,
  LastOf,
  MostRecentExtractionType,
  LastOfExtractionType,
  FillerKindType,
  ForMostRecent
} from "./Data/Query";
import {
  InternalVersionedRow,
  versionedMapper,
  VersionedRow
} from "./Data/Response";
import { Granularity } from "../../Data/Enums";

export class VersionedQuery extends Q.QueryWithExtractionInterval {
  _queryParams: Partial<VersionedQueryParams>;
  /**
   * Set the granularity of the extracted marketdata
   * @param g The granulairty in which to extract data
   */
  InGranularity(g: Granularity) {
    this._queryParams.granularity = g;
    return this;
  }
  /**
   * Set the time transform to be applied to extraction
   * @param tr The Time Tramsform id to be applied to the extraction
   */
  WithTimeTransform(tr: number) {
    this._queryParams.tr = tr;
    return this;
  }
  /**
   * Set the number of versions to retrieve in the extraction
   * @param n The number of previous versions to extract
   */
  ForLastNVersions(n: number) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastN,
      val: n
    };
    return this;
  }
  /**
   * Set the version selection type to MUV
   */
  ForMuv() {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.MUV
    };
    return this;
  }
  /**
   * Set For Most Recent date range version selection
   * @param extraction the extraction selection
   */
  ForMostRecent(extraction: MostRecentExtractionType) {
    if (Object.keys(ExtractionRangeType).indexOf(extraction.tag.toString()) == -1)
      throw "Not valid extraction";

    this._queryParams.versionSelection = {
      tag: VersionSelectionType.ForMostRecent,
      extraction
    }
    return this;
  }
  /**
   * Set Last Of Days date range version selection
   * @param extraction the extraction selection
   */
  ForLastOfDays(extraction: LastOfExtractionType) {
    if (
      Object.keys(ExtractionRangeType).indexOf(extraction.tag.toString()) == -1
    )
      throw "Not a valid extraction";
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastOf,
      lastOfType: LastOfType.Days,
      extraction
    };
    return this;
  }
  /**
   * Set Last Of Months date range version selection
   * @param extraction the extraction selection
   */
  ForLastOfMonths(extraction: LastOfExtractionType) {
    if (
      Object.keys(ExtractionRangeType).indexOf(extraction.tag.toString()) == -1
    )
      throw "Not a valid extraction";
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastOf,
      lastOfType: LastOfType.Months,
      extraction
    };
    return this;
  }
  /**
   * Set specific version selection
   * @param val Date time of the version to be extracted
   */
  ForVersion(val: Date) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.Version,
      val
    };
    return this;
  }
  /**
   * Set the Filler Strategy to Null
   */
  WithFillNull() {
    this._queryParams.fill = { fillerType: FillerKindType.Null };
    return this;
  }
  /**
   * Set the Filler Strategy to None
   */
  WithFillNone() {
    this._queryParams.fill = { fillerType: FillerKindType.NoFill };
    return this;
  }
  /**
   * Set the Filler Strategy to Latest Value
   */
  WithFillLatestValue(p: string) {
    this._queryParams.fill = {
      fillerType: FillerKindType.LatestValidValue,
      fillerPeriod: p,
    };
    return this;
  }
  /**
   * Set the Filler Strategy to Custom
   */
  WithFillCustomValue(val: number){
    this._queryParams.fill = {fillerType: FillerKindType.CustomValue, fillerValue:val}
    return this;
  }
  /**
   * Execute the query
   */
  Execute(): Promise<VersionedRow[]> {
    return validateQuery(this._queryParams)
      .then(R.of)
      .then(this.partitionStrategy.Versioned)
      .then(R.map(buildUrl))
      .then(R.map(url => this.client.get<InternalVersionedRow>(url)))
      .then(x => Promise.all(x))
      .then(R.unnest)
      .then(R.map(versionedMapper));
  }
}

/**
 * Create a version extraction range with dates
 * @param start start date of version range
 * @param end end date of version range
 */
export function inDateRange(start: Date, end: Date): LastOfExtractionType {
  return {
    tag: ExtractionRangeType.DateRange,
    start,
    end
  };
}
/**
 * Create a version extraction range with a period
 * @param period the period of the version range
 */
export function inPeriod(period: string): LastOfExtractionType {
  return {
    tag: ExtractionRangeType.Period,
    Period: period
  };
}
/**
 * Create a version extraction range with a start and an end period
 * @param start start of period range
 * @param end end of period range
 */
export function inPeriodRange(
  start: string,
  end: string
): LastOfExtractionType {
  return {
    tag: ExtractionRangeType.PeriodRange,
    PeriodFrom: start,
    PeriodTo: end
  };
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function formatDateTime(d: Date) {
  return d.toISOString().split(".")[0];
}
function validateVersionParams(
  q: Partial<VersionedQueryParams>
): Promise<VersionedQueryParams> {
  if (q.granularity == undefined)
    return Promise.reject("Granularity is required");
  if (q.versionSelection == undefined)
    return Promise.reject("Version Selection is required");
  return Promise.resolve(q as VersionedQueryParams);
}

function buildMostRecentRoute(q: ForMostRecent): string {
  switch (q.extraction.tag) {
    case ExtractionRangeType.DateRange:
      return (
        `${formatDateTime(q.extraction.start)}/` +
        `${formatDateTime(q.extraction.end)}`
      );
    case ExtractionRangeType.Period:
      return (
        `${q.extraction.Period}`
      );
    case ExtractionRangeType.PeriodRange:
      return (
        `${q.extraction.PeriodFrom}/` +
        `${q.extraction.PeriodTo}`
      );
  }
}
function buildLastOfRoute(q: LastOf): string {
  switch (q.extraction.tag) {
    case ExtractionRangeType.DateRange:
      return (
        `${VersionSelectionType[q.tag]}${LastOfType[q.lastOfType]}/` +
        `${formatDate(q.extraction.start)}/` +
        `${formatDate(q.extraction.end)}`
      );
    case ExtractionRangeType.Period:
      return (
        `${VersionSelectionType[q.tag]}${LastOfType[q.lastOfType]}/` +
        `${q.extraction.Period}`
      );
    case ExtractionRangeType.PeriodRange:
      return (
        `${VersionSelectionType[q.tag]}${LastOfType[q.lastOfType]}/` +
        `${q.extraction.PeriodFrom}/` +
        `${q.extraction.PeriodTo}`
      );
  }
}
function validateQuery(
  q: Partial<VersionedQueryParams>
): Promise<VersionedQueryParams> {
  return Q.validateQuery(q).then(() => validateVersionParams(q));
}
function buildUrl(q: VersionedQueryParams): string {
  return (
    "vts/" +
    `${buildVersionRoute(q)}/` +
    `${Granularity[q.granularity]}/` +
    `${Q.buildExtractionRangeRoute(q)}` +
    `?${getUrlQueryParams(q)}`
  );
}
function buildVersionRoute(q: VersionedQueryParams): string {
  switch (q.versionSelection.tag) {
    case VersionSelectionType.LastN:
      return "Last" + q.versionSelection.val;
    case VersionSelectionType.MUV:
      return "MUV";
    case VersionSelectionType.Version:
      return "Version/" + q.versionSelection.val.toISOString().split(".")[0];
    case VersionSelectionType.LastN:
      return "Last" + q.versionSelection.val;
    case VersionSelectionType.LastOf:
      return buildLastOfRoute(q.versionSelection);
    case VersionSelectionType.ForMostRecent:
      return buildMostRecentRoute(q.versionSelection);
  }
}
function getUrlQueryParams(q: VersionedQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    fillQueryParam(q),
    getCurveSelectionParamsWithInterval(q),
    addTimeTransformQueryParam(q)
  ]
    .filter(Boolean)
    .join("&");
}
function fillQueryParam(q: VersionedQueryParams): string {
  if(q.fill == null)
    return "";

  switch (q.fill?.fillerType) {
    case FillerKindType.Null:
      case FillerKindType.NoFill:
      return `fillerK=${q.fill.fillerType}`;
    case FillerKindType.LatestValidValue:
      return `fillerK=${q.fill.fillerType}&fillerP=${q.fill.fillerPeriod}`;
    case FillerKindType.CustomValue:
      return `fillerK=${q.fill.fillerType}&fillerDV=${q.fill.fillerValue}`;
  };
}