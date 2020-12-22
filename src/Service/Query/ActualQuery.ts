import * as R from "ramda";
import * as Q from "./QueryWithExtractionInterval";
import * as QueryBase from "./Query";
import {
  ActualQueryParams,
  getCurveSelectionParamsWithInterval,
  addTimeTransformQueryParam,
  FillerKindType,
} from "./Data/Query";
import { ActualRow, InternalActualRow, actualMapper } from "./Data/Response";
import { Granularity } from "../../Data/Enums";

function validateGranularity(
  q: Partial<ActualQueryParams>
): Promise<ActualQueryParams> {
  if (q.granularity == undefined)
    return Promise.reject("Granularity is required");
  return Promise.resolve(q as ActualQueryParams);
}

export class ActualQuery extends Q.QueryWithExtractionInterval {
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
   * Execute the Query
   */
  Execute(): Promise<ActualRow[]> {
    return validateQuery(this._queryParams)
      .then(R.of)
      .then(this.partitionStrategy.Actual)
      .then(R.map(buildUrl))
      .then(R.map(url => this.client.get<InternalActualRow>(url)))
      .then(x => Promise.all(x))
      .then(R.unnest)
      .then(R.map(actualMapper));
  }
}
function validateQuery(
  q: Partial<ActualQueryParams>
): Promise<ActualQueryParams> {
  return Q.validateQuery(q).then(() => validateGranularity(q));
}
function buildUrl(q: ActualQueryParams): string {
  return (
    "ts/" +
    `${Granularity[q.granularity]}/` +
    `${Q.buildExtractionRangeRoute(q)}` + 
    `?${getUrlQueryParams(q)}`
  );
}
function getUrlQueryParams(q: ActualQueryParams): string {
  return [
    QueryBase.getUrlQueryParams(q),
    fillQueryParam(q),
    getCurveSelectionParamsWithInterval(q),
    addTimeTransformQueryParam(q)
  ]
    .filter(Boolean)
    .join("&");
}

function fillQueryParam(q: ActualQueryParams): string {
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