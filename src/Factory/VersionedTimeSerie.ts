import { UpsertCurveData } from './../Service/MarketData/MarketDataService.UpsertCurve';
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { Output } from "../Service/MarketData/Data/MarketDataEntity";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import { AddTimeSerieOperationResult } from "../Data/Enums";
import { IsTimeGranularity, IsStartOfInterval, MapToMarketData, toDateString } from "../Common/ArtesianUtils";
import * as L from "luxon";

export class VersionedTimeSerie{
    _marketDataService: MarketDataService;
    _entity?: Output = undefined;
    _identifier: MarketDataIdentifier;
    _values: Map<Date,number | undefined> = new Map();
    
    constructor(marketData: MarketData){
        this._entity = marketData._entity;
        this._marketDataService = marketData._marketDataService;
        this._identifier = ({ provider: this._entity.ProviderName, name: this._entity.MarketDataName });
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
        return this._add(localDate, value);
    }

    private _add(localTime: Date, value?: number){
        const utcTime = L.DateTime.fromJSDate(localTime).toUTC().toJSDate();

        if (this._values.has(utcTime)){
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

        this._values.set(utcTime,value);

        return AddTimeSerieOperationResult.ValueAdded;
    }

    async Save(downloadedAt: Date, deferCommandExecution: boolean = false, deferDataGeneration: boolean = true){
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
                    version: toDateString(this.SelectedVersion),
                    timezone: IsTimeGranularity(this._entity.OriginalGranularity) ? "UTC" : this._entity.OriginalTimezone,
                    downloadedAt,
                    rows: MapToMarketData(this._values),
                    deferCommandExecution: deferCommandExecution,
                    deferDataGeneration: deferDataGeneration
                })
        
             await this._marketDataService.UpsertCurve.UpsertCurevData(data);
            }
            //else
            //    _logger.Warn("No Data to be saved.");
        }
        
    }
