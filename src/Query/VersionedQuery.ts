import { Query } from "./Query";
import {
  VersionedQueryParams,
  VersionSelectionType,
  Granularity,
  getCurveSelectionParams,
  addTimeTransformQueryParam,
  LastOfDays,
  LastOfMonths
} from "./Data/Query";
import {
  InternalVersionedRow,
  versionedMapper,
  VersionedRow
} from "./Data/Response";

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
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

function buildVersionRoute(q: LastOfDays | LastOfMonths): string {
  return (
    `${VersionSelectionType[q.tag]}/` +
    `${formatDate(q.start)}/` +
    `${formatDate(q.end)}`
  );
}
export class VersionedQuery extends Query {
  _queryParams: Partial<VersionedQueryParams>;
  _routePrefix = "vts";
  InGranularity(g: Granularity) {
    this._queryParams.granularity = g;
    return this;
  }
  ForLastNVersions(n: number) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastN,
      val: n
    };
    return this;
  }
  ForMuv() {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.MUV
    };
    return this;
  }
  ForLastOfDays(start: Date, end: Date) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastOfDays,
      start,
      end
    };
    return this;
  }
  ForLastOfMonths(start: Date, end: Date) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.LastOfMonths,
      start,
      end
    };
    return this;
  }
  ForVersion(val: Date) {
    this._queryParams.versionSelection = {
      tag: VersionSelectionType.Version,
      val
    };
    return this;
  }
  validateQuery(): Promise<VersionedQueryParams> {
    return super
      .validateQuery()
      .then(() => validateVersionParams(this._queryParams));
  }
  buildUrl(): Promise<string> {
    return this.validateQuery().then(
      q =>
        `${this._routePrefix}/` +
        `${this.buildVersionRoute(q)}/` +
        `${Granularity[q.granularity]}/` +
        `${this.buildExtractionRangeRoute(q)}` +
        `?${this.getUrlQueryParams(q)}`
    );
  }
  buildVersionRoute(q: VersionedQueryParams): string {
    switch (q.versionSelection.tag) {
      case VersionSelectionType.LastN:
        return "Last" + q.versionSelection.val;
      case VersionSelectionType.MUV:
        return "MUV";
      case VersionSelectionType.Version:
        return "Version/" + q.versionSelection.val;
      case VersionSelectionType.LastN:
        return "Last" + q.versionSelection.val;
      case VersionSelectionType.LastOfDays:
      case VersionSelectionType.LastOfMonths:
        return buildVersionRoute(q.versionSelection);
    }
  }
  getUrlQueryParams(q: VersionedQueryParams): string {
    return [
      super.getUrlQueryParams(q),
      getCurveSelectionParams(q),
      addTimeTransformQueryParam(q)
    ]
      .filter(Boolean)
      .join("&");
  }
  execute(): Promise<VersionedRow[]> {
    return this.buildUrl()
      .then(url => this.client.get<InternalVersionedRow[]>(url))
      .then(res => res.data.map(versionedMapper));
  }
}
