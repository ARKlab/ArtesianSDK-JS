import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class Acl {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  /**
   * Retrieve the ACL Path Roles by path
   * @param path The path (starting with "/" char. Ex. "/marketdata/system/" identifies folder "marketdata" with a subfolder "system", roles are assigned to "system" subfolder. Ex. "/marketdata/genoacurve" identifies folder "marketdata" with entity "genoacurve", roles are assigned to "genoacurve" entity.
   * Returns Enumerable of AuthorizationPath Output entity
   */
  ReadRolesByPath(path: string) {
    var url = "/acl/me/" + path;

    return this._client.get<AclPath>(url);
  }
  /**
   *  Retrieve the ACL Path Roles paged
   * @param page The requested page
   * @param pageSize The size of the page
   * @param principalIds The principal ids I want to inspect, encoded.( ex. u:user@example.com for users and clients,g:1001 for groups)
   * @param asOf LocalDateTime we want to inspect
   * Returns AuthorizationPath Output entity
   */
  GetRoles(
    page: number,
    pageSize: number,
    principalIds: string[],
    asOf?: Date | null
  ) {
    if (page < 1) throw "page needs to be greater than 0";
    if (pageSize < 1) throw "pageSize needs to be greater than 0";

    var url =
      "/acl?" +
      [
        `pageSize=${pageSize}`,
        `page=${page}`,
        `principalIds=${principalIds.map(encodeURIComponent).join(",")}`,
        asOf ? `asOf=${asOf.toISOString().split("T")[0]}` : ""
      ]
        .filter(Boolean)
        .join("&");

    return this._client.get<PagedResult<AclPath>>(url);
  }
  /**
   * Upsert the ACL Path Roles
   * @param upsert The entity we want to upsert
   */
  UpsertRoles(upsert: AclPath) {
    var url = "/acl";

    return this._client.post<void>(url, upsert);
  }
  /**
   * Add a role to the ACL Path
   * @param add The entity we want to add. At the path add.Path we add the add.Roles
   */
  AddRoles(add: AclPath) {
    var url = "/acl/roles";

    return this._client.post<void>(url, add);
  }
  /**
   * Remove a role from the ACL Path
   * @param upsert The entity we want to remove. At the path remove.Path we remove the remove.Roles
   */
  RemoveRoles(upsert: AclPath) {
    var url = "/acl/roles";
    //todo check delete body
    //method returned as post in testing rather than delete
    return this._client.request<void>({ url, data: upsert, method: "delete" });
  }
}

type AclPath = {
  path: string;
  roles: AuthorizationPrincipalRole[];
};

type AuthorizationPrincipalRole = {
  role: string;
  principal: Principal;
  inherritedFrom: string;
};
type Principal = {
  principalType: PrincipalType;
  principalId: string;
};
export enum PrincipalType {
  Group,
  User
}
