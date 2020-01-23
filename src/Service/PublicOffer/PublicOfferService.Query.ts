import { AxiosInstance } from "axios";
import { PublicOfferQuery } from "./PublicOfferQuery";
export class Query {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }

  /**
   * Create Public offer query
   */
  CreatePublicOfferQuery() {
    return new PublicOfferQuery(
      this._client,
    );
  }
}
