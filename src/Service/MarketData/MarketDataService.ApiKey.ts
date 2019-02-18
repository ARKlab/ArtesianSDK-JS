import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class ApiKey {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Create new ApiKey
   * @param keyRecord the entity we are going to insert
   * Returns ApiKey Output entity
   */
  Create(keyRecord: Input) {
    if(keyRecord.id !=0){
      throw new Error("Api Key must be 0")
    }
    var url = "/apikey/entity";

    return this._client.post<Output>(url, keyRecord);
  }
  /**
   * Retrieve the ApiKey entity
   * @param key The Key
   * Returns ApiKey Output entity
   */
  GetByKey(key: string) {
    var url = `/apikey/entity?key=${key}`;

    return this._client.get<Output>(url);
  }
  /**
   * Retrieve the ApiKey entity
   * @param id The id
   * Returns ApiKey Output entity
   */
  GetById(id: number) {
    var url = `/apikey/entity/${id}`;

    return this._client.get<Output>(url);
  }
  /**
   * Retrieve the apikeys paged
   * @param page the requested page
   * @param pageSize the size of the page
   * @param userId the userid we want to filter for
   * Returns Paged result of ApiKey Output entity
   */
  GetByUserId(page: number, pageSize: number, userId: string) {
    if (page < 1) throw "page needs to be greater than 0";
    if (pageSize < 1) throw "pageSize needs to be greater than 0";
    var url =
      "/apikey/entity?" +
      [`pageSize=${pageSize}`, `page=${page}`, `userId=${userId}`].join("&");

    return this._client.get<PagedResult<Output>>(url);
  }
  /**
   * Delete the ApiKey
   * @param id The id
   */
  Delete(id: number) {
    var url = "/apikey/entity/" + id;

    return this._client.delete(url);
  }
}
export type Input = {
  id: number;
  eTag?: string;
  usagePerDay?: number;
  expiresAt?: Date;
  description?: string;
};
type Output = {
  id: number;
  eTag: string;
  usagePerDay?: number;
  expiresAt: Date;
  description: string;
  userId: string;
  key: string;
  createdAt: Date;
};
