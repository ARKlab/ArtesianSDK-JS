import { AxiosInstance } from 'axios';
import { MarketDataIdentifier } from './../Service/MarketData/MarketDataService.MarketData';
import { MarketData } from './MarketData';
import { MarketDataService } from '../Service/MarketData/MarketDataService';

export class MarketDataServiceExtensions{
    _client: AxiosInstance;
    constructor(client: AxiosInstance){
        this._client = client;
    }

    getMarketDataReference(marketDataService : MarketDataService, id : MarketDataIdentifier): MarketData{
        return new MarketData(marketDataService, id);
    }
    
}