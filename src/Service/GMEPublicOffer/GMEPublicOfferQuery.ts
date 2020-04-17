import {
    GMEPublicOfferQueryParams,
  } from "./Data/Query";
import { Status, Purpose, BAType, GenerationType, Market, Scope, UnitType, Zone, } from "./Data/Enums";
import { GMEPublicOfferCurve } from "./Data/Query";
import { PagedResult } from "./Data/Response";
import { IGMEPublicOfferService } from "./GMEPublicOfferService";
  
  export class GMEPublicOfferQuery {
    _queryParams: Partial<GMEPublicOfferQueryParams> = {};
    constructor(private _client: IGMEPublicOfferService) {}

   /**
   * Set the date to be queried
   * @param date
   */
  ForDate(date: Date) {
    this._queryParams.date = date;
    return this;
  }

  /**
   * Set the status to be queried
   * @param status
   */
  ForStatus(status: Status) {
    this._queryParams.status = status;
    return this;
  }

  /**
   * Set the status to be queried
   * @param purpose
   */
  ForPurpose(purpose: Purpose) {
    this._queryParams.purpose = purpose;
    return this;
  }

  /**
   * Set the baTypes to be queried
   * @param baType
   */
  ForBAType(baType: BAType[]) {
    this._queryParams.baType = baType;
    return this;
  }

  /**
   * Set the generationTypes to be queried
   * @param generationType
   */
  ForGenerationType(generationType: GenerationType[]) {
    this._queryParams.generationType = generationType;
    return this;
  }

  /**
   * Set the markets to be queried
   * @param market
   */
  ForMarket(market: Market[]) {
    this._queryParams.market = market;
    return this;
  }

  /**
   * Set the operators to be queried
   * @param operator
   */
  ForOperator(operator: string[]) {
    this._queryParams.operator = operator;
    return this;
  }

  /**
   * Set the units to be queried
   * @param unit
   */
  ForUnit(unit: string[]) {
    this._queryParams.unit = unit;
    return this;
  }

  /**
   * Set the scopes to be queried
   * @param scope
   */
  ForScope(scope: Scope[]) {
    this._queryParams.scope = scope;
    return this;
  }

  /**
   * Set the unitTypes to be queried
   * @param unitType
   */
  ForUnitType(unitType: UnitType[]) {
    this._queryParams.unitType = unitType;
    return this;
  }

  /**
   * Set the zones to be queried
   * @param zone
   */
  ForZone(zone: Zone[]) {
    this._queryParams.zone = zone;
    return this;
  }

    /**
   * Set the request pagination
   * @param page
   * @param pageSize
   */
  WithPagination(page: number, pageSize: number) {
    this._queryParams.page = page;
    this._queryParams.pageSize = pageSize;
    return this;
  }

  Execute(): Promise<PagedResult<GMEPublicOfferCurve>> {
    return validateQuery(this._queryParams)
      .then(buildUrl)
      .then(url => this._client.Get<PagedResult<GMEPublicOfferCurve>>(url));
  }
}

function validateQuery(
  q: Partial<GMEPublicOfferQueryParams>
): Promise<GMEPublicOfferQueryParams> {
  if (q.date == undefined)
    return Promise.reject("Date is required");
  if (q.status == undefined)
    return Promise.reject("Status is required");
  if (q.purpose == undefined)
    return Promise.reject("Purpose is required");
  return Promise.resolve(q as GMEPublicOfferQueryParams);
}

function buildUrl(q: GMEPublicOfferQueryParams): string {
  return (
    "extract/" +
    `${q.date.toISOString().split("T")[0]}/` +
    `${q.purpose}/` +
    `${q.status}` +
    `?${getUrlQueryParams(q)}`
  );
}

function getUrlQueryParams(q: GMEPublicOfferQueryParams): string {
  return [
    q.operator ? `operators=${q.operator.join(",")}` : "",
    q.unit ? `unit=${q.unit.join(",")}` : "",
    q.market ? `market=${q.market.join(",")}` : "",
    q.scope ? `scope=${q.scope.join(",")}` : "",
    q.baType ? `baType=${q.baType.join(",")}` : "",
    q.zone ? `zone=${q.zone.join(",")}` : "",
    q.unitType ? `unitType=${q.unitType.join(",")}` : "",
    q.generationType ? `generationType=${q.generationType.join(",")}` : "",
    q.sort ? `sort=${q.sort.join(",")}` : "",
    q.page ? `page=${q.page}` : "",
    q.pageSize ? `pageSize=${q.pageSize}` : ""
  ]
    .filter(Boolean)
    .join("&");
}

  