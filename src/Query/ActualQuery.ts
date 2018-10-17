import * as Q from "./Query";
import {
  ActualQueryParams,
  Granularity,
  getCurveSelectionParams,
  addTimeTransformQueryParam
} from "./Data/Query";
import { ActualRow, InternalActualRow, actualMapper } from "./Data/Response";

function validateGranularity(
  q: Partial<ActualQueryParams>
): Promise<ActualQueryParams> {
  if (q.granularity == undefined)
    return Promise.reject("Granularity is required");
  return Promise.resolve(q as ActualQueryParams);
}

export class ActualQuery extends Q.Query {
  _queryParams: Partial<ActualQueryParams>;
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
   * Execute the Query
   */
  Execute(): Promise<ActualRow[]> {
    return buildUrl(this._queryParams)
      .then(url => this.client.get<InternalActualRow[]>(url))
      .then(res => res.data.map(actualMapper));
  }
}

function validateQuery(
  q: Partial<ActualQueryParams>
): Promise<ActualQueryParams> {
  return Q.validateQuery(q).then(() => validateGranularity(q));
}
function buildUrl(q: Partial<ActualQueryParams>): Promise<string> {
  return validateQuery(q).then(
    q =>
      "ts/" +
      `${Granularity[q.granularity]}/` +
      `${Q.buildExtractionRangeRoute(q)}` +
      `?${getUrlQueryParams(q)}`
  );
}
function getUrlQueryParams(q: ActualQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    getCurveSelectionParams(q),
    addTimeTransformQueryParam(q)
  ]
    .filter(Boolean)
    .join("&");
}