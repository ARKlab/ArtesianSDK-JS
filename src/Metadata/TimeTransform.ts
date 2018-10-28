import { AxiosInstance } from "axios";
import { TimeTransform } from "./Data/MarketData";
import { PagedResult } from "./Data/Response";

export class TimeTransformSDK {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  GetById(timeTransformId: number) {
    const url = `/timetransform/entity/${timeTransformId}`;
    return this._client.get<TimeTransform>(url);
  }
  Get(page: number, pageSize: number, userDefined: boolean) {
    const url =
      `/timetransform/entity?` +
      `page=${page}` +
      `pageSize=${pageSize}` +
      `userDefined=${userDefined}`;

    return this._client.get<PagedResult<TimeTransform>>(url);
  }
  Create(timeTransform: TimeTransform) {
    const url = "/timetransform/entity";

    return this._client.post<TimeTransform>(url, timeTransform);
  }
  Update(timeTransform: TimeTransform) {
    const url = "/timetransform/entity/" + timeTransform.id;

    return this._client.put<TimeTransform>(url, timeTransform);
  }
  Delete(timeTransformId: number) {
    const url = "/timetransform/entity/" + timeTransformId;

    return this._client.delete(url);
  }
}
