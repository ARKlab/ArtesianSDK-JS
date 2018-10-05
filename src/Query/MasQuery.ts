import { Query } from "./Query";
import { MasQueryParams, getCurveSelectionParams } from "./Data/Query";
import { MasRow, InternalMasRow, masMapper } from "./Data/Response";

function validateProducts(q: Partial<MasQueryParams>): Promise<MasQueryParams> {
  if (q.products == undefined) return Promise.reject("Products are required");
  return Promise.resolve(q as MasQueryParams);
}
function getProductParams(q: MasQueryParams): string {
  return "p=" + q.products.map(encodeURIComponent).join(",");
}
export class MasQuery extends Query {
  _queryParams: Partial<MasQueryParams>;
  _routePrefix = "mas";
  ForProducts(products: string[]) {
    this._queryParams.products = products;
    return this;
  }
  validateQuery(): Promise<MasQueryParams> {
    return super
      .validateQuery()
      .then(() => validateProducts(this._queryParams));
  }
  buildUrl(): Promise<string> {
    return this.validateQuery().then(
      q =>
        `${this._routePrefix}/` +
        `${this.buildExtractionRangeRoute(q)}` +
        `?${this.getUrlQueryParams(q)}`
    );
  }
  getUrlQueryParams(q: MasQueryParams): string {
    return [
      super.getUrlQueryParams(q),
      getCurveSelectionParams(q),
      getProductParams(q)
    ]
      .filter(Boolean)
      .join("&");
  }
  execute(): Promise<MasRow[]> {
    return this.buildUrl()
      .then(url => this.client.get<InternalMasRow[]>(url))
      .then(res => res.data.map(masMapper));
  }
}
