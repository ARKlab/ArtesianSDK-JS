import { UpsertCurveData } from './../Service/MarketData/MarketDataService.UpsertCurve';
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { Output } from "../Service/MarketData/Data/MarketDataEntity";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import { AddTimeSerieOperationResult } from "../Data/Enums";
import { IsTimeGranularity, MapTimePeriod, MapDatePeriod, atMidnight } from "../Common/ArtesianUtils";
import { IsStartOfIntervalDate, IsStartOfIntervalTime } from "../Common/Intervals";
import * as L from "luxon";

export class VersionedTimeSerie{
    _marketDataService: MarketDataService;
    _entity?: Output = undefined;
    _identifier: MarketDataIdentifier;
    _values: Map<Date,number | undefined> = new Map();
    
    constructor(marketData: MarketData){
        this._entity = marketData._entity;
        this._marketDataService = marketData._marketDataService;
        this._identifier = ({ provider: this._entity.providerName, name: this._entity.marketDataName });
        this.Values = this._values;
    }

    _SelectedVersion: Date;
    get SelectedVersion(): Date{
        return this._SelectedVersion;
    }
    set SelectedVersion(value:Date){
        this._SelectedVersion = value;
    }

    get Values(): Map<Date,number | undefined>{
        return this._values;
    }
    set Values(value: Map<Date,number | undefined>){
        this._values = value;
    }
    SetSelectedVersion(version: Date){
        if((this.SelectedVersion != null) && (this.Values.size !=0))
            throw new Error("SelectedVersion can't be changed if the curve contains values. Current Version is " + this.SelectedVersion);
        
        this.SelectedVersion = version;
    }

    clearData(){
        this._values = new Map<Date,number | undefined>();
        this.Values = this._values;
    }

    AddData(localDate : Date, value? : number){
        if(this._entity == null){
            throw new Error("entity  null");
        }

        if(IsTimeGranularity(this._entity.originalGranularity)){
            throw new Error("This MarketData has Time granularity. Use AddData(Instant time, double? value");
        }

        var localTime = atMidnight(localDate);

        return this._add(localTime, value);
    }

    private _add(localTime: Date, value?: number){

        if (this._values.has(localTime)){
            return AddTimeSerieOperationResult.TimeAlreadyPresent;
        }
        var period;

        if (this._entity === undefined) {
            throw new Error(this._entity + " entity is undefined");
        }

        if(IsTimeGranularity(this._entity.originalGranularity)){
            period = MapTimePeriod(this._entity.originalGranularity);
            if(!IsStartOfIntervalTime(localTime,period)){
                throw new Error("Trying to insert Time " + localTime + " with the wrong format to serie " + this._identifier + ". Should be of period " + period);
            }
        }
        else{
            period = MapDatePeriod(this._entity.originalGranularity);
            if(!IsStartOfIntervalDate(localTime,period)){
                throw new Error("Trying to insert Time " + localTime + " with the wrong format to serie " + this._identifier + ". Should be of period " + period);
            }
        }

        this._values.set(localTime,value);

        return AddTimeSerieOperationResult.ValueAdded;
    }

    Save(downloadedAt: Date, deferCommandExecution: boolean = false, deferDataGeneration: boolean = true){
        if(this.SelectedVersion == null){
            throw new Error ("No version has been selected to save Data");
        }

        if (this._entity === undefined) {
            throw new Error(this._entity + " entity is undefined");
        }

        if (this._values.size > 0)
            {
                var data: UpsertCurveData = ({
                    id: this._identifier,
                    version: this.SelectedVersion,
                    timezone: IsTimeGranularity(this._entity.originalGranularity) ? "UTC" : this._entity.originalTimezone,
                    downloadedAt: downloadedAt,
                    rows: MapToMarketData(this._values),
                    deferCommandExecution: deferCommandExecution,
                    deferDataGeneration: deferDataGeneration
                })
        
             this._marketDataService.UpsertCurve.UpsertCurevData(data);
            }
            //else
            //    _logger.Warn("No Data to be saved.");
        }
        
    }

type MarketDataEntry = { Key: string; Value?: number };
function MapToMarketData(
    params: Map<Date, number | undefined>
): MarketDataEntry[] {
    return Array.from(params.entries())
    .map(([k, v]) => [
        L.DateTime.fromJSDate(k).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        v,
    ] as const)
    .map(([Key, Value]) => ({ Key, Value }));
}