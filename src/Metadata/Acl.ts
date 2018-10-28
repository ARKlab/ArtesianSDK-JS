import { AxiosInstance } from "axios";
import { PagedResult } from "./Data/Response";

export class Acl {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  ReadRolesByPath(path: string) {
    var url = "/acl/me/" + path;

    return this._client.get<AclPath>(url);
  }
  GetRoles(
    page: number,
    pageSize: number,
    principalIds: string[],
    asOf?: Date
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
  UpsertRoles(upsert: AclPath) {
    var url = "/acl";

    return this._client.post<void>(url, upsert);
  }
  AddRoles(add: AclPath) {
    var url = "/acl/roles";

    return this._client.post<void>(url, add);
  }
  RemoveRoles(upsert: AclPath) {
    var url = "/acl/roles";
    //todo check delete body
    return this._client.post<void>(url, upsert, { method: "delete" });
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
enum PrincipalType {
  Group,
  User
}
