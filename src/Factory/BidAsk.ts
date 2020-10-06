import {
  UpsertCurveData,
  BidAskValue,
} from "../Service/MarketData/MarketDataService.UpsertCurve";
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { Output } from "../Service/MarketData/Data/MarketDataEntity";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import {
  IsStartOfInterval,
  toDateString,
  IsTimeGranularity,
} from "../Common/ArtesianUtils";
import { AddBidAskOperationResult } from './../Data/Enums';
import * as R from "ramda";
import * as L from "luxon";

export class BidAsk {
  _marketDataService: MarketDataService;
  _entity?: Output = undefined;
  _identifier: MarketDataIdentifier;

  constructor(marketData: MarketData) {
    this._entity = marketData._entity;
    this._marketDataService = marketData._marketDataService;
    this._identifier = {
      provider: this._entity.ProviderName,
      name: this._entity.MarketDataName,
    };
    this.BidAsks = new Array<BidAskElement>();
  }

  _BidAsks: Array<BidAskElement>;
  get BidAsks(): Array<BidAskElement> {
    return this._BidAsks;
  }
  set BidAsks(value: Array<BidAskElement>) {
    this._BidAsks = value;
  }

  clearData() {
    this.BidAsks = [];
  }

  AddData(localDate: Date, product: string, value: BidAskValue) {
    if (this._entity === undefined) return;

    return this._addBidAsk(localDate, product, value);
  }

  private _addBidAsk(
    reportTime: Date,
    product: string,
    value: BidAskValue
  ) {
    const utcTime = L.DateTime.fromJSDate(reportTime).toUTC().toJSDate();
    var re = /\+\d+$/;
    if (re.test(product)) {
      throw new Error("Relative Products are not supported");
    }

    if (this._entity === undefined)
      throw new Error(this._entity + " entity is undefined");

    if (!IsStartOfInterval(utcTime, this._entity.OriginalGranularity))
      throw new Error(
        "Trying to insert Time " +
          utcTime +
          " with wrong format to serie " +
          this._identifier.name +
          ". Should be of period " +
          this._entity.OriginalGranularity
      );

    if (
      this.BidAsks.some(
        (row) => row.ReportTime == reportTime && row.Product === product
      )
    )
      return AddBidAskOperationResult.ProductAlreadyPresent;

    this.BidAsks.push({
      Product: product,
      ReportTime: utcTime,
      Value: value,
    });
    return AddBidAskOperationResult.BidAskAdded;
  }

  async Save(
    downloadedAt: Date,
    deferCommandExecution: boolean = false,
    deferDataGeneration: boolean = true
  ) {
    if (this._entity === undefined) {
      throw new Error(this._entity + " entity is undefined");
    }

    if (this.BidAsks.length > 0) {
      var data: UpsertCurveData = {
        id: this._identifier,
        timezone: IsTimeGranularity(this._entity.OriginalGranularity)
          ? "UTC"
          : this._entity.OriginalTimezone,
        downloadedAt: downloadedAt,
        deferCommandExecution: deferCommandExecution,
        deferDataGeneration: deferDataGeneration,
      };

      const groupByReportTime = R.groupBy<BidAskElement>(
        R.pipe<BidAskElement, Date, string>(
          R.prop("ReportTime"),
          toDateString
        )
      );
      const groupByProduct = R.pipe(
        R.groupBy<BidAskElement>(R.prop("Product")),
        R.mapObjIndexed<BidAskElement[], BidAskElement>(R.last),
        R.mapObjIndexed<BidAskElement, BidAskValue>(
          (x) => x.Value
        )
      );

      const grouping = groupByReportTime(this.BidAsks);
      const bidasks = R.mapObjIndexed(groupByProduct, grouping);

      data.bidAsk = RecordToDictionary(
        R.mapObjIndexed(RecordToDictionary, bidasks)
      );

      await this._marketDataService.UpsertCurve.UpsertCurevData(data);
    }
  }
}
function RecordToDictionary<A>(rec: {
  [key: string]: A;
}): { Key: string; Value: A }[] {
  return Object.entries(rec).map(([k, v]) => ({ Key: k, Value: v }));
}
type BidAskElement = {
  ReportTime: Date;
  Product: string;
  Value: BidAskValue;
};
