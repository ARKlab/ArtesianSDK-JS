import { UpsertCurveData } from "./../Service/MarketData/MarketDataService.UpsertCurve";
import { MarketDataIdentifier } from "./../Service/MarketData/MarketDataService.MarketData";
import { Output } from "./../Service/MarketData/Data/MarketDataEntity";
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { MarketData } from "./MarketData";
import { AddTimeSerieOperationResult } from "../Data/Enums";
import {
  IsTimeGranularity,
  IsStartOfInterval,
  MapToMarketData,
} from "../Common/ArtesianUtils";
import * as L from "luxon";

export class ActualTimeSerie {
  _marketDataService: MarketDataService;
  _entity?: Output = undefined;
  _identifier: MarketDataIdentifier;
  _values: Map<Date, number | undefined> = new Map();

  constructor(marketData: MarketData) {
    this._entity = marketData._entity;
    this._marketDataService = marketData._marketDataService;
    this._identifier = {
      provider: this._entity.ProviderName,
      name: this._entity.MarketDataName,
    };
    this.Values = this._values;
  }

  get Values(): Map<Date, number | undefined> {
    return this._values;
  }
  set Values(value: Map<Date, number | undefined>) {
    this._values = value;
  }

  clearData() {
    this._values = new Map();
    this.Values = this._values;
  }

  AddData(date: Date, value: number) {
    if (this._entity == null) {
      throw new Error("entity  null");
    }

    return this._add(date, value);
  }

  private _add(localTime: Date, value: number) {
    const utcTime = L.DateTime.fromJSDate(localTime).toUTC().toJSDate();
    if (this._values.has(utcTime)) {
      return AddTimeSerieOperationResult.TimeAlreadyPresent;
    }

    if (this._entity === undefined) {
      throw new Error(this._entity + " entity is undefined");
    }
    if (!IsStartOfInterval(utcTime, this._entity.OriginalGranularity))
      throw new Error(
        "Trying to insert Time " +
          utcTime +
          " with wrong format to serie " +
          this._identifier.name +
          ". Should be of period " +
          this._entity.OriginalGranularity
      );

    this._values.set(utcTime, value);

    return AddTimeSerieOperationResult.ValueAdded;
  }

  async Save(
    downloadedAt: Date,
    deferCommandExecution: boolean = false,
    deferDataGeneration: boolean = true
  ) {
    if (this._entity == null) {
      throw new Error(this._entity + " entity is null");
    }

    if (this._values.size > 0) {
      var data: UpsertCurveData = {
        id: this._identifier,
        timezone: IsTimeGranularity(this._entity.OriginalGranularity)
          ? "UTC"
          : this._entity.OriginalTimezone,
        downloadedAt,
        rows: MapToMarketData(this._values),
        deferCommandExecution: deferCommandExecution,
        deferDataGeneration: deferDataGeneration,
      };

      await this._marketDataService.UpsertCurve.UpsertCurevData(data);
    }
  }
}
