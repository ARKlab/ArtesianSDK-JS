import * as R from "ramda";
import * as Q from "./QueryWithExtractionInterval";
import { BidAskQueryParams, BidAskValue, FillerKindType, getCurveSelectionParamsWithInterval } from "./Data/Query";
import { BidAskRow, InternalBidAskRow, bidAskMapper } from "./Data/Response";

export class BidAskQuery extends Q.QueryWithExtractionInterval {
  _queryParams: Partial<BidAskQueryParams>;
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
  WithFillCustomValue(val: BidAskValue){
    this._queryParams.fill = {fillerType: FillerKindType.CustomValue, fillerValue:val}
    return this;
  }
  /**
   * Execute the query
   */
  Execute(): Promise<BidAskRow[]> {
    return validateQuery(this._queryParams)
      .then(R.of)
      .then(this.partitionStrategy.BidAsk)
      .then(R.map(buildUrl))
      .then(R.map(url => this.client.get<InternalBidAskRow>(url)))
      .then(x => Promise.all(x))
      .then(R.unnest)
      .then(R.map(bidAskMapper));
  }
}

function validateQuery(q: Partial<BidAskQueryParams>): Promise<BidAskQueryParams> {
  return Q.validateQuery(q).then(() => validateProducts(q));
}
function buildUrl(q: BidAskQueryParams): string {
  return `ba/${Q.buildExtractionRangeRoute(q)}?${getUrlQueryParams(q)}`;
}
function getUrlQueryParams(q: BidAskQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    fillQueryParam(q),
    getCurveSelectionParamsWithInterval(q),
    getProductParams(q)
  ]
    .filter(Boolean)
    .join("&");
}
function validateProducts(q: Partial<BidAskQueryParams>): Promise<BidAskQueryParams> {
  if (q.products == undefined) return Promise.reject("Products are required");
  return Promise.resolve(q as BidAskQueryParams);
}
function getProductParams(q: BidAskQueryParams): string {
  return "p=" + q.products.map(encodeURIComponent).join(",");
}

function fillQueryParam(q: BidAskQueryParams): string {
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
        ["fillerDVbbp", q.fill.fillerValue.bestBidPrice],
        ["fillerDVbap", q.fill.fillerValue.bestAskPrice],
        ["fillerDVbbq", q.fill.fillerValue.bestBidQuantity],
        ["fillerDVbaq", q.fill.fillerValue.bestAskQuantity],
        ["fillerDVlp", q.fill.fillerValue.lastPrice],
        ["fillerDVlq", q.fill.fillerValue.lastQuantity],
      ]
        .filter(([_, val]) => Boolean(val))
        .map((x) => x.join("="))
        .join("&");
  }
}