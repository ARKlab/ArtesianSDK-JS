import { AxiosInstance } from "axios";
import { TimeTransform } from "./Data/MarketDataEntity";
import { PagedResult } from "./Data/Response";

export class TimeTransformSDK {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Read a time transform entity from the service by ID
   * @param timeTransformId ID of the time transform to be retrieved
   * Returns Time Transform Entity
   */
  GetById(timeTransformId: number) {
    const url = `/timetransform/entity/${timeTransformId}`;
    return this._client.get<TimeTransform>(url);
  }
  /**
   * Read a paged set of time transform entities from the service
   * @param page Page number
   * @param pageSize Page size
   * @param userDefined Retrieve either user or system defined time transforms
   * Returns Paged Result of Time Transform Entity
   */
  Get(page: number, pageSize: number, userDefined: boolean) {
    const url =
      `/timetransform/entity` +
      `?page=${page}` +
      `&pageSize=${pageSize}` +
      `&userDefined=${userDefined}`;

    return this._client.get<PagedResult<TimeTransform>>(url);
  }
  /**
   * Register a new TimeTransform
   * @param timeTransform The entity we are going to insert
   * Returns Time Transform Entity
   */
  Create(timeTransform: TimeTransform) {
    const url = "/timetransform/entity";

    return this._client.post<TimeTransform>(url, timeTransform);
  }
  /**
   * Update the TimeTransform
   * @param timeTransform The entity we are going to update
   * Returns Time Transform Entity
   */
  Update(timeTransform: TimeTransform) {
    const url = "/timetransform/entity/" + timeTransform.id;

    return this._client.put<TimeTransform>(url, timeTransform);
  }
  /**
   * Delete the TimeTransform
   * @param timeTransformId The entity id we are going to delete
   */
  Delete(timeTransformId: number) {
    const url = "/timetransform/entity/" + timeTransformId;

    return this._client.delete(url);
  }
}
