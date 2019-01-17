import { UpsertCurveData, MarketAssessmentValue } from './../Service/MarketData/MarketDataService.UpsertCurve';
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { Output } from './../Service/MarketData/Data/MarketDataEntity';
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import { IsTimeGranularity, MapTimePeriod, MapDatePeriod } from "../Common/ArtesianUtils";
import { AddAssessmentOperationResult, DateString } from "../Data/Enums";
import { IsStartOfIntervalDate, IsStartOfIntervalTime } from "../Common/Intervals";
import * as R from 'ramda';

export class MarketAssessment {
    _marketDataService: MarketDataService;
    _entity?: Output = undefined;
    _identifier: MarketDataIdentifier;

    constructor(marketData: MarketData) {
        this._entity = marketData._entity;
        this._marketDataService = marketData._marketDataService;
        this._identifier = ({ provider: this._entity.providerName, name: this._entity.marketDataName })
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
        if (this._entity === undefined)
            return
        if (IsTimeGranularity(this._entity.originalGranularity)) {
            throw new Error("This MarketData has Time granularity. Use AddData(Instant time, double? value");
        }

        return this._addAssessment(localDate.toDateString(), product, value);
    }

    private _addAssessment(reportTime: DateString, product: string, value: MarketAssessmentValue) {
        var re = /\+\d+$/
        if (re.test(product)) {
            throw new Error("Relative Products are not supported");
        }

        var period;

        if (this._entity === undefined)
            return;

        if (IsTimeGranularity(this._entity.originalGranularity)) {
            period = MapTimePeriod(this._entity.originalGranularity);
            if (!IsStartOfIntervalTime(new Date(reportTime),period))
                throw new Error("Trying to insert Report Time " + new Date(reportTime) + " with the wrong format to Assessment " + this._identifier + ". Should be of period " +  period);
        }
        else {

            period = MapDatePeriod(this._entity.originalGranularity);
            if(!IsStartOfIntervalDate(new Date(reportTime),period)){
                throw new Error("Trying to insert Time " + new Date(reportTime) + " with the wrong format to serie " + this._identifier + ". Should be of period " + period);
            }
        }

        if (this.Assessments.some(row => row.ReportTime == reportTime && row.Product === product))
            return AddAssessmentOperationResult.ProductAlreadyPresent;

        this.Assessments.push(new AssessmentElement(reportTime, product, value));
        return AddAssessmentOperationResult.AssessmentAdded;
    }

    Save(downloadedAt: Date, deferCommandExecution: boolean = false, deferDataGeneration: boolean = true) {

        if (this._entity === undefined) {
            throw new Error(this._entity + " entity is undefined");
        }

        if (this.Assessments.length > 0) {
            var data: UpsertCurveData = ({
                id: this._identifier,
                timezone: this._entity.originalTimezone,
                downloadedAt: downloadedAt,
                deferCommandExecution: deferCommandExecution,
                deferDataGeneration: deferDataGeneration
            })

            const groupByReportTime = R.groupBy<AssessmentElement>(R.prop('ReportTime'));
            const groupByProduct = R.pipe(
                R.groupBy<AssessmentElement>(R.prop('Product')),
                R.mapObjIndexed<AssessmentElement[], AssessmentElement>(R.last),
                R.mapObjIndexed<AssessmentElement, MarketAssessmentValue>(x => x.Value),
            );

            const grouping = groupByReportTime(this.Assessments);
            const assessments = R.mapObjIndexed(groupByProduct, grouping);

            data.marketAssessment = assessments;

            this._marketDataService.UpsertCurve.UpsertCurevData(data);
        }
    }
}

class AssessmentElement {
    private _ReportTime: DateString;
    private _Product: string;
    private _Value: MarketAssessmentValue;
    constructor(_reportTime: DateString, _product: string, _value: MarketAssessmentValue) {
    }

    get ReportTime(): DateString {
        return this._ReportTime;
    }
    set ReportTime(value: DateString) {
        this._ReportTime = value;
    }

    get Product(): string {
        return this._Product;
    }
    set Product(value: string) {
        this._Product = value;
    }

    get Value(): MarketAssessmentValue {
        return this._Value;
    }
    set Value(value: MarketAssessmentValue) {
        this._Value = value;
    }
}