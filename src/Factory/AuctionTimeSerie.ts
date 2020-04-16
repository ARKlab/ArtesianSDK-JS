import { atMidnight } from '../Common/ArtesianUtils';
import { UpsertCurveData } from '../Service/MarketData/MarketDataService.UpsertCurve';
import { MarketDataIdentifier } from '../Service/MarketData/MarketDataService.MarketData';
import { Output } from '../Service/MarketData/Data/MarketDataEntity';
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import { MarketData } from  "./MarketData";
import { AddTimeSerieOperationResult } from "../Data/Enums";
import { IsTimeGranularity, MapTimePeriod, MapDatePeriod} from "../Common/ArtesianUtils";
import { IsStartOfIntervalDate, IsStartOfIntervalTime } from "../Common/Intervals";
import * as L from "luxon";

export class AuctionTimeSerie{
    _marketDataService: MarketDataService;
    _entity? : Output = undefined;
    _identifier : MarketDataIdentifier;
    _values: Map<Date, AuctionBids> = new Map();
    
    constructor(marketData: MarketData){
        this._entity = marketData._entity;
        this._marketDataService = marketData._marketDataService;
        this._identifier = ({ provider: this._entity.providerName, name: this._entity.marketDataName });
        this.Values = this._values;
    }

    get Values(): Map<Date, AuctionBids>{
        return this._values;
    }
    set Values(value: Map<Date, AuctionBids>){
        this._values = value;
    }

    clearData(){
         this._values = new Map();
         this.Values = this._values;
    }

    AddData(localDate : Date, bid : AuctionBidValue[], offer : AuctionBidValue[])
    {   
        if(this._entity == null){
            throw new Error("entity  null");
        }

        if(IsTimeGranularity(this._entity.originalGranularity)){
            throw new Error("This MarketData has Time granularity. Use AddData(Instant time, double? value");
        }

        var localTime = atMidnight(localDate);

        return this._add(localTime, bid, offer);
    }

    private _add(localTime: Date, bid : AuctionBidValue[], offer : AuctionBidValue[])
    {
        if (this._values.has(localTime)){
            return AddTimeSerieOperationResult.TimeAlreadyPresent;
        }

        this._values.forEach(auction => {

            auction.bid.forEach(element => {
                if(element.quantity < 0)
                    throw new RangeError(`Auction[${auction.bidTimestamp}] contains invalid Bid Quantity < 0`)
                });

            auction.offer.forEach(element => {
                if(element.quantity < 0)
                    throw new RangeError(`Auction[${auction.bidTimestamp}] contains invalid Offer Quantity < 0`)
                });
        });
        
        var period;

        if (this._entity === undefined)
            throw new Error(this._entity + " entity is undefined");

        if (IsTimeGranularity(this._entity.originalGranularity))
        {
            period = MapTimePeriod(this._entity.originalGranularity);
            if (!IsStartOfIntervalTime(localTime,period))
                throw new Error("Trying to insert Time " + localTime + " with wrong format to serie " + this._identifier + ". Should be of period " + period);
        }
        else
        {
            period = MapDatePeriod(this._entity.originalGranularity);
            if(!IsStartOfIntervalDate(localTime,period)){
                throw new Error("Trying to insert Time " + localTime + " with the wrong format to serie " + this._identifier + ". Should be of period " + period);
            }
        }
      
        //iso
        //expected output: Wed, 14 Jun 2017 07:00:00 GMT
        //this._values[localTime.toUTCString()]= value
        this._values.set(localTime, {bidTimestamp: localTime, bid: bid, offer: offer} );

        return AddTimeSerieOperationResult.ValueAdded;
    }

    Save(downloadedAt: Date, deferCommandExecution: boolean = false, deferDataGeneration: boolean = true)
    {
        if(this._entity == null)
            throw new Error (this._entity + " entity is null");

        if (this._values.size > 0)
            {
                var data: UpsertCurveData = ({
                    id: this._identifier,
                    timezone: IsTimeGranularity(this._entity.originalGranularity) ? "UTC" : this._entity.originalTimezone,
                    downloadedAt: downloadedAt,
                    auctionRows: [...this._values.entries()].map(([k, v]) => ({
                        Key: L.DateTime.fromJSDate(k).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
                        Value: v,
                      })),
                    deferCommandExecution: deferCommandExecution,
                    deferDataGeneration: deferDataGeneration
                })
        
             this._marketDataService.UpsertCurve.UpsertCurevData(data);
            }
            //else
            //    _logger.Warn("No Data to be saved.");
        }
    }

export type AuctionBids = 
{
    bidTimestamp: Date,
    bid: AuctionBidValue[],
    offer: AuctionBidValue[]
}

export type AuctionBidValue = 
{
    price: number,
    quantity: number
}

    