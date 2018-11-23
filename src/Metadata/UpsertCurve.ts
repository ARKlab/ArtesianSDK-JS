import { AxiosInstance } from "axios";
import { MarketDataIdentifier } from "./MarketData";

export class UpsertCurve {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
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
    //todo validate
    const url = "/marketdata/upsertdata";

    return this._client.post(url, data);
  }
}
type UpsertCurveData = {
  id: MarketDataIdentifier;
  version?: Date;
  timezone: string;
  downloadedAt: Date;
  marketAssessment?: Record<DateString, Record<string, MarketAssessmentValue>>;
  rows?: Record<DateString, number>;
  deferCommandExecution?: boolean;
  deferDataGeneration?: boolean;
};


type MarketAssessmentValue = {
  settlement?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  volumePaid?: number;
  volueGiven?: number;
  volume?: number;
};

type DateString = string;
