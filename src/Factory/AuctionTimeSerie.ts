import { IsStartOfInterval, toDateString } from "../Common/ArtesianUtils";
import { UpsertCurveData } from "../Service/MarketData/MarketDataService.UpsertCurve";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { Output } from "../Service/MarketData/Data/MarketDataEntity";
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { MarketData } from "./MarketData";
import { AddTimeSerieOperationResult } from "../Data/Enums";
import { IsTimeGranularity } from "../Common/ArtesianUtils";
import * as L from "luxon";

export class AuctionTimeSerie {
  _marketDataService: MarketDataService;
  _entity?: Output = undefined;
  _identifier: MarketDataIdentifier;
  _values: Map<Date, AuctionBids> = new Map();

  constructor(marketData: MarketData) {
    this._entity = marketData._entity;
    this._marketDataService = marketData._marketDataService;
    this._identifier = {
      provider: this._entity.ProviderName,
      name: this._entity.MarketDataName,
    };
    this.Values = this._values;
  }

  get Values(): Map<Date, AuctionBids> {
    return this._values;
  }
  set Values(value: Map<Date, AuctionBids>) {
    this._values = value;
  }

  clearData() {
    this._values = new Map();
    this.Values = this._values;
  }

  AddData(localDate: Date, bid: AuctionBidValue[], offer: AuctionBidValue[]) {
    if (this._entity == null) {
      throw new Error("entity  null");
    }

    return this._add(localDate, bid, offer);
  }

  private _add(
    localTime: Date,
    bid: AuctionBidValue[],
    offer: AuctionBidValue[]
  ) {
    const utcTime = L.DateTime.fromJSDate(localTime).toUTC().toJSDate();
    if (this._values.has(utcTime)) {
      return AddTimeSerieOperationResult.TimeAlreadyPresent;
    }

    this._values.forEach((auction) => {
      auction.bid.forEach((element) => {
        if (element.quantity < 0)
          throw new RangeError(
            `Auction[${auction.bidTimestamp}] contains invalid Bid Quantity < 0`
          );
      });

      auction.offer.forEach((element) => {
        if (element.quantity < 0)
          throw new RangeError(
            `Auction[${auction.bidTimestamp}] contains invalid Offer Quantity < 0`
          );
      });
    });

    if (this._entity === undefined)
      throw new Error(this._entity + " entity is undefined");

    if (!IsStartOfInterval(utcTime, this._entity.OriginalGranularity)) {
      throw new Error(
        "Trying to insert Time " +
          utcTime +
          " with the wrong format to serie " +
          this._identifier +
          ". Should be of period " +
          this._entity.OriginalGranularity
      );
    }

    this._values.set(utcTime, {
      bidTimestamp: utcTime,
      bid: bid,
      offer: offer,
    });

    return AddTimeSerieOperationResult.ValueAdded;
  }

  async Save(
    downloadedAt: Date,
    deferCommandExecution: boolean = false,
    deferDataGeneration: boolean = true
  ) {
    if (this._entity == null) throw new Error(this._entity + " entity is null");

    if (this._values.size > 0) {
      var data: UpsertCurveData = {
        id: this._identifier,
        timezone: IsTimeGranularity(this._entity.OriginalGranularity)
          ? "UTC"
          : this._entity.OriginalTimezone,
        downloadedAt,
        auctionRows: Array.from(this._values.entries()).map(([k, v]) => ({
          Key: toDateString(k),
          Value: {
            bidTimestamp: toDateString(v.bidTimestamp),
            bid: v.bid,
            offer: v.offer,
          },
        })),
        deferCommandExecution: deferCommandExecution,
        deferDataGeneration: deferDataGeneration,
      };

      await this._marketDataService.UpsertCurve.UpsertCurevData(data);
    }
    //else
    //    _logger.Warn("No Data to be saved.");
  }
}

export type AuctionBids = {
  bidTimestamp: Date;
  bid: AuctionBidValue[];
  offer: AuctionBidValue[];
};

export type AuctionBidValue = {
  price: number;
  quantity: number;
};
