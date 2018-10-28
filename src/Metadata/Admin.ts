import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class Admin {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  CreateAuthGroup(group: AuthGroup) {
    var url = "/group";

    return this._client.post<AuthGroup>(url, group);
  }
  UpdateAuthGroup(groupId: number, group: AuthGroup) {
    var url = "/group/" + groupId;

    return this._client.put<AuthGroup>(url, group);
  }
  RemoveAuthGroup(groupId: number) {
    var url = "/group/" + groupId;

    return this._client.delete(url);
  }
  ReadAuthGroup(groupId: number) {
    var url = "/group/" + groupId;

    return this._client.get<AuthGroup>(url);
  }
  ReadAuthGroups(page: number, pageSize: number) {
    var url = "/group?" + [`pageSize=${pageSize}`, `page=${page}`].join("&");

    return this._client.get<PagedResult<AuthGroup>>(url);
  }
  ReadUserPrincipals(user: string) {
    var url = `/user/principals?user=${user}`;

    return this._client.get<Principals[]>(url);
  }
}
type AuthGroup = {
  id: number;
  eTag: string;
  name: string;
  users: string[];
};

type Principals = {
  principal: string;
  type: string;
};
