import { PublicOfferQuery } from "./PublicOfferQuery";
import { IPublicOfferService } from "./PublicOfferService";
export class Query {
  constructor(private _client: IPublicOfferService) {}

  /**
   * Create Public offer query
   */
  CreatePublicOfferQuery() {
    return new PublicOfferQuery(
      this._client,
    );
  }
}
