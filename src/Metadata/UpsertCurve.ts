import { AxiosInstance } from "axios";
import { MarketDataIdentifier } from "./MarketData";

export class UpsertCurve {
  _client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this._client = client;
  }
  UpsertCurevData(data: UpsertCurveData) {
    //todo validate
    const url = "/marketdata/upsertdata";

    return this._client.post(url, data);
  }
}
type UpsertCurveData = {
  id: MarketDataIdentifier;
  version: Date;
  timezone: string;
  downloadedAt: Date;
  marketAssessment: Record<DateString, Record<string, MarketAssessmentValue>>;
  rows: Record<DateString, number>;
  deferCommandExecution: boolean;
  deferDataGeneration: boolean;
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
