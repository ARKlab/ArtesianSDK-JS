import {
  UpsertCurveData,
  MarketAssessmentValue,
} from "./../Service/MarketData/MarketDataService.UpsertCurve";
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { Output } from "./../Service/MarketData/Data/MarketDataEntity";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import {
  IsStartOfInterval,
  toDateString,
  IsTimeGranularity,
} from "../Common/ArtesianUtils";
import { AddAssessmentOperationResult } from "../Data/Enums";
import * as R from "ramda";
import * as L from "luxon";

export class MarketAssessment {
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
    this.Assessments = new Array<AssessmentElement>();
  }

  _Assessments: Array<AssessmentElement>;
  get Assessments(): Array<AssessmentElement> {
    return this._Assessments;
  }
  set Assessments(value: Array<AssessmentElement>) {
    this._Assessments = value;
  }

  clearData() {
    this.Assessments = [];
  }

  AddData(localDate: Date, product: string, value: MarketAssessmentValue) {
    if (this._entity === undefined) return;

    return this._addAssessment(localDate, product, value);
  }

  private _addAssessment(
    reportTime: Date,
    product: string,
    value: MarketAssessmentValue
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
      this.Assessments.some(
        (row) => row.ReportTime == reportTime && row.Product === product
      )
    )
      return AddAssessmentOperationResult.ProductAlreadyPresent;

    this.Assessments.push({
      Product: product,
      ReportTime: utcTime,
      Value: value,
    });
    return AddAssessmentOperationResult.AssessmentAdded;
  }

  async Save(
    downloadedAt: Date,
    deferCommandExecution: boolean = false,
    deferDataGeneration: boolean = true
  ) {
    if (this._entity === undefined) {
      throw new Error(this._entity + " entity is undefined");
    }

    if (this.Assessments.length > 0) {
      var data: UpsertCurveData = {
        id: this._identifier,
        timezone: IsTimeGranularity(this._entity.OriginalGranularity)
          ? "UTC"
          : this._entity.OriginalTimezone,
        downloadedAt: downloadedAt,
        deferCommandExecution: deferCommandExecution,
        deferDataGeneration: deferDataGeneration,
      };

      const groupByReportTime = R.groupBy<AssessmentElement>(
        R.pipe<AssessmentElement, Date, string>(
          R.prop("ReportTime"),
          toDateString
        )
      );
      const groupByProduct = R.pipe(
        R.groupBy<AssessmentElement>(R.prop("Product")),
        R.mapObjIndexed<AssessmentElement[], AssessmentElement>(R.last),
        R.mapObjIndexed<AssessmentElement, MarketAssessmentValue>(
          (x) => x.Value
        )
      );

      const grouping = groupByReportTime(this.Assessments);
      const assessments = R.mapObjIndexed(groupByProduct, grouping);

      data.marketAssessment = RecordToDictionary(
        R.mapObjIndexed(RecordToDictionary, assessments)
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
type AssessmentElement = {
  ReportTime: Date;
  Product: string;
  Value: MarketAssessmentValue;
};
