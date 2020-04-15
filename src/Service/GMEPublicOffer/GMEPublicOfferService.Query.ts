import { GMEPublicOfferQuery } from "./GMEPublicOfferQuery";
import { IGMEPublicOfferService } from "./GMEPublicOfferService";
export class Query {
  constructor(private _client: IGMEPublicOfferService) {}

  /**
   * Create Public offer query
   */
  CreatePublicOfferQuery() {
    return new GMEPublicOfferQuery(
      this._client,
    );
  }
}
