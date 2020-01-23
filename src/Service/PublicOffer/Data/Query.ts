import { Purpose, Status, Market, Scope, BAType, Zone, UnitType, GenerationType } from "./Enums"
export type PublicOfferQueryParams = {
    Date: Date;
    purpose: Purpose;
    status: Status;
    operator: string[];
    unit: string[];
    market: Market[];
    scope: Scope[];
    baType: BAType[];
    zone: Zone[];
    unitType: UnitType[];
    generationType: GenerationType[];
    sort: string[];
    page: number;
    pageSize: number;
  };

  export type GMEPublicOfferCurve = {
        Status: Status;
        BAType: BAType;
        Scope: Scope;
        Date: Date;
        Hour: number;
        Market: Market;
        Purpose: Purpose;
        Zone: Zone;
        UnitType: UnitType;
        GenerationType: GenerationType;
        Unit: string;
        Operator: string;
        AwardedQuantity: number;
        EnergyPrice: number;
        MeritOrder: number;
        PartialQuantityAccepted: string;
        ADJQuantity: number;
        ADJEnergyPrice: number;
  }