import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class Admin {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Create a new Authorization Group
   * @param group The entity we are going to insert
   * Returns Auth Group entity
   */
  CreateAuthGroup(group: AuthGroup) {
    var url = "group";

    return this._client.post<AuthGroup>(url, group);
  }
  /**
   * Update an Authorization Group
   * @param groupId The entity Identifier
   * @param group The entity to update
   * Returns Auth Group entity
   */
  UpdateAuthGroup(groupId: number, group: AuthGroup) {
    var url = "group/" + groupId;

    return this._client.put<AuthGroup>(url, group);
  }
  /**
   * Remove an Authorization Group
   * @param groupId The entity Identifier
   */
  RemoveAuthGroup(groupId: number) {
    var url = "group/" + groupId;

    return this._client.delete(url);
  }
  /**
   * Read Authorization Group
   * @param groupId The entity Identifier
   * Returns AuthGroup entity
   */
  ReadAuthGroup(groupId: number) {
    var url = "group/" + groupId;

    return this._client.get<AuthGroup>(url);
  }
  /**
   * Remove an Authorization Group
   * @param page The requested page
   * @param pageSize The size of the page
   * Returns Paged result of Auth Group entity
   */
  ReadAuthGroups(page: number, pageSize: number) {
    var url = "group?" + [`pageSize=${pageSize}`, `page=${page}`].join("&");

    return this._client.get<PagedResult<AuthGroup>>(url);
  }
  /**
   * Get a list of Principals of the selected user
   * @param user The user name
   * Returns List of Principals entity
   */
  ReadUserPrincipals(user: string) {
    var url = `user/principals?user=${user}`;

    return this._client.get<Principals[]>(url);
  }
}
export type AuthGroup = {
  id: number;
  eTag?: string;
  name: string;
  users?: string[];
};

type Principals = {
  principal: string;
  type: string;
};
