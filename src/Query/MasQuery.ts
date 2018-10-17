import * as Q from "./Query";
import { MasQueryParams, getCurveSelectionParams } from "./Data/Query";
import { MasRow, InternalMasRow, masMapper } from "./Data/Response";

export class MasQuery extends Q.Query {
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
   * Execute the query
   */
  Execute(): Promise<MasRow[]> {
    return buildUrl(this._queryParams)
      .then(url => this.client.get<InternalMasRow[]>(url))
      .then(res => res.data.map(masMapper));
  }
}
function validateQuery(q: Partial<MasQueryParams>): Promise<MasQueryParams> {
  return Q.validateQuery(q).then(() => validateProducts(q));
}
function buildUrl(q: Partial<MasQueryParams>): Promise<string> {
  return validateQuery(q).then(
    q =>
      "mas/" + `${Q.buildExtractionRangeRoute(q)}` + `?${getUrlQueryParams(q)}`
  );
}
function getUrlQueryParams(q: MasQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    getCurveSelectionParams(q),
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
