import * as R from "ramda";
import * as Q from "./QueryWithExtractionInterval";
import { BidAskQueryParams, getCurveSelectionParamsWithInterval } from "./Data/Query";
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
