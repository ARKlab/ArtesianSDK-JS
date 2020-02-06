import * as R from "ramda";
import * as Q from "./QueryWithExtractionRange";
import {
  AuctionQueryParams,
  getCurveSelectionParamsWithRange
} from "./Data/Query";
import { AuctionRow, InternalAuctionRow, auctionMapper } from "./Data/Response";

export class AuctionQuery extends Q.QueryWithExtractionRange {
  _queryParams: Partial<AuctionQueryParams>;
  /**
   * Execute the Query
   */
  Execute(): Promise<AuctionRow[]> {
    return validateQuery(this._queryParams)
      .then(R.of)
      .then(this.partitionStrategy.Auction)
      .then(R.map(buildUrl))
      .then(R.map(url => this.client.get<InternalAuctionRow>(url)))
      .then(x => Promise.all(x))
      .then(R.unnest)
      .then(R.map(auctionMapper));
  }
}
function validateQuery(
  q: Partial<AuctionQueryParams>
): Promise<AuctionQueryParams> {
  return Q.validateQuery(q);
}
function buildUrl(q: AuctionQueryParams): string {
  return (
    "auction/" +
    `${Q.buildExtractionRangeRoute(q)}` +
    `?${getUrlQueryParams(q)}`
  );
}
function getUrlQueryParams(q: AuctionQueryParams): string {
  return [
    Q.getUrlQueryParams(q),
    getCurveSelectionParamsWithRange(q),
  ]
    .filter(Boolean)
    .join("&");
}
