import { Query } from "./Query";
import {
  ActualQueryParams,
  Granularity,
  getCurveSelectionParams,
  addTimeTransformQueryParam
} from "./Data/Query";
import "./Data/Response";
import { ActualRow, InternalActualRow, actualMapper } from "./Data/Response";

function validateGranularity(
  q: Partial<ActualQueryParams>
): Promise<ActualQueryParams> {
  if (q.granularity == undefined)
    return Promise.reject("Granularity is required");
  return Promise.resolve(q as ActualQueryParams);
}

export class ActualQuery extends Query {
  _queryParams: Partial<ActualQueryParams>;
  _routePrefix = "ts";
  InGranularity(g: Granularity) {
    this._queryParams.granularity = g;
    return this;
  }
  WithTimeTransform(tr: number) {
    this._queryParams.tr = tr;
    return this;
  }
  validateQuery(): Promise<ActualQueryParams> {
    return super
      .validateQuery()
      .then(() => validateGranularity(this._queryParams));
  }
  buildUrl(): Promise<string> {
    return this.validateQuery().then(
      q =>
        `${this._routePrefix}/` +
        `${Granularity[q.granularity]}/` +
        `${this.buildExtractionRangeRoute(q)}` +
        `?${this.getUrlQueryParams(q)}`
    );
  }
  Execute(): Promise<ActualRow[]> {
    return this.buildUrl()
      .then(url => this.client.get<InternalActualRow[]>(url))
      .then(res => res.data.map(actualMapper));
  }
  getUrlQueryParams(q: ActualQueryParams): string {
    return [
      super.getUrlQueryParams(q),
      getCurveSelectionParams(q),
      addTimeTransformQueryParam(q)
    ]
      .filter(Boolean)
      .join("&");
  }
}
