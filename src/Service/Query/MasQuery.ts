import * as R from "ramda";
import * as Q from "./QueryWithExtractionInterval";
import { MasQueryParams, getCurveSelectionParamsWithInterval, FillerKindType } from "./Data/Query";
import { MasRow, InternalMasRow, masMapper } from "./Data/Response";
import { MarketAssessmentValue } from "../MarketData/MarketDataService.UpsertCurve";

export class MasQuery extends Q.QueryWithExtractionInterval {
  _queryParams: Partial<MasQueryParams>;
  /**
   * Set list of market products to be queried
   * @param products List of products to be queried
   */
  ForProducts(products: string[]) {
    this._queryParams.products = products;
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
  WithFillCustomValue(val: MarketAssessmentValue){
    this._queryParams.fill = {fillerType: FillerKindType.CustomValue, fillerValue:val}
    return this;
  }
  /**
   * Execute the query
   */
  Execute(): Promise<MasRow[]> {
    return validateQuery(this._queryParams)
      .then(R.of)
      .then(this.partitionStrategy.Mas)
      .then(R.map(buildUrl))
      .then(R.map(url => this.client.get<InternalMasRow>(url)))
      .then(x => Promise.all(x))
      .then(R.unnest)
      .then(R.map(masMapper));
  }
}

function validateQuery(q: Partial<MasQueryParams>): Promise<MasQueryParams> {
  return Q.validateQuery(q).then(() => validateProducts(q));
}
function buildUrl(q: MasQueryParams): string {
  return `mas/${Q.buildExtractionRangeRoute(q)}?${getUrlQueryParams(q)}`;
}
function getUrlQueryParams(q: MasQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    fillQueryParam(q),
    getCurveSelectionParamsWithInterval(q),
    getProductParams(q)
  ]
    .filter(Boolean)
    .join("&");
}
function validateProducts(q: Partial<MasQueryParams>): Promise<MasQueryParams> {
  if (q.products == undefined) return Promise.reject("Products are required");
  return Promise.resolve(q as MasQueryParams);
}
function getProductParams(q: MasQueryParams): string {
  return "p=" + q.products.map(encodeURIComponent).join(",");
}

function fillQueryParam(q: MasQueryParams): string {
  if (q.fill == null) return "";

  switch (q.fill?.fillerType) {
    case FillerKindType.Null:
    case FillerKindType.NoFill:
      return `fillerK=${q.fill.fillerType}`;
    case FillerKindType.LatestValidValue:
      return `fillerK=${q.fill.fillerType}&fillerP=${q.fill.fillerPeriod}`;
    case FillerKindType.CustomValue:
      return [
        ["fillerK", q.fill.fillerType],
        ["fillerDVs", q.fill.fillerValue.settlement],
        ["fillerDVo", q.fill.fillerValue.open],
        ["fillerDVc", q.fill.fillerValue.close],
        ["fillerDVh", q.fill.fillerValue.high],
        ["fillerDVl", q.fill.fillerValue.low],
        ["fillerDVvp", q.fill.fillerValue.volumePaid],
        ["fillerDVvg", q.fill.fillerValue.volueGiven],
        ["fillerDVvt", q.fill.fillerValue.volume],
      ]
        .filter(([_, val]) => Boolean(val))
        .map((x) => x.join("="))
        .join("&");
  }
}
