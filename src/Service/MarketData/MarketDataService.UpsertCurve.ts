import { AuctionBidValue } from "./../../Factory/AuctionTimeSerie";
import { validateUpsertCurveData } from "./../../Common/validators";
import { MarketDataIdentifier } from "./MarketDataService.MarketData";
import { IService } from "./MarketDataService";

export class UpsertCurve {
  constructor(private _client: IService) {}
  /**
   * Upsert the curve data supplied in <paramref name="data"/>
   * remarks
   *    Unified controller for saving curve data
   *    ID, TimeZone and DownloadedAt fields should always be not null
   *    - Market Data Assessment: MarketAssessment field should not be null, other fields should be null
   *     - Actual TimeSerie: Rows field should not be null, other fields should be null-
   *     - Versioned TimeSerie: Rows and Version fields should not be null, other fields should be null
   * @param data An object that rappresent MarketDataAssessment, ActualTimeSerie or VersionedTimeSerie
   */
  UpsertCurevData(data: UpsertCurveData) {
    validateUpsertCurveData(data);

    const url = "marketdata/upsertdata";

    return this._client.post(url, data);
  }
}

export type DateTime = string;
export type Product = string;
export type UpsertCurveData = {
  id: MarketDataIdentifier;
  version?: DateTime;
  timezone: string;
  downloadedAt: Date;
  marketAssessment?: {
    Key: DateTime;
    Value: { Key: Product; Value: MarketAssessmentValue }[];
  }[];
  rows?: Array<{ Key: DateTime; Value?: number }>;
  deferCommandExecution?: boolean;
  deferDataGeneration?: boolean;
  auctionRows?: Array<{ Key: DateTime; Value: AuctionBid }>;
  bidAsk?: {
    Key: DateTime;
    Value: { Key: Product; Value: BidAskValue }[];
  }[];
};

type AuctionBid = {
  bidTimestamp: DateTime;
  bid: AuctionBidValue[];
  offer: AuctionBidValue[];
};
export type MarketAssessmentValue = {
  settlement?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  volumePaid?: number;
  volueGiven?: number;
  volume?: number;
};

export type BidAskValue = {
  bestBidPrice?: number;
  bestAskPrice?: number;
  bestBidQuantity?: number;
  bestAskQuantity?: number;
  lastPrice?: number;
  lastQuantity?: number;

};
