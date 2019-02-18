import { MarketDataService } from '../Service/MarketData/MarketDataService';
import { Output, Input, MarketDataType } from '../Service/MarketData/Data/MarketDataEntity';
import { MarketDataIdentifier } from '../Service/MarketData/MarketDataService.MarketData';
import { MarketDataMetadata } from './MarketDataMetadata';
import { ActualTimeSerie } from './ActualTimeSerie';
import { MarketAssessment } from './MarketAssessment';
import { VersionedTimeSerie } from './VersionedTimeSerie';
import { isNullOrWhitespace } from '../Data/Enums';

export class MarketData {
    _marketDataService: MarketDataService;
    _entity: Output;

    _marketDataId?: number;
    get marketDataId(): number | undefined {
        return this._entity.marketDataId;
    }

    _identifier: MarketDataIdentifier;
    get identifier(): MarketDataIdentifier {
        return this._identifier;
    }
    set identifier(value: MarketDataIdentifier) {
        this._identifier = value;
    }

    _metaData: MarketDataMetadata;
    get metaData(): MarketDataMetadata {
        return this._metaData;
    }
    set metaData(value: MarketDataMetadata) {
        this._metaData = value;
    }

    constructor(marketDataService: MarketDataService, id: MarketDataIdentifier) {
        if (marketDataService == null || id == null) {
            throw new Error('Parameter null exception');
        }
        this._marketDataService = marketDataService;
        this.identifier = id;
    }

    isTrue(conditionOne:boolean,conditionTwo:boolean): boolean{
        if (conditionOne == true || conditionTwo == true){
            return true;
        }
        return false;
    }

    async Register(metadata: Input): Promise<void> {

        if (metadata == null) {
            return Promise.reject(new Error('' + metadata));
        }
        if (!this.isTrue(metadata.providerName == null, metadata.providerName == this.identifier.provider)) {
            return Promise.reject(new Error('' + metadata.providerName));
        }
        if (!this.isTrue(metadata.marketDataName == null , metadata.marketDataName == this.identifier.name)) {
            return Promise.reject(new Error('' + metadata.providerName));
        }
        
        if (isNullOrWhitespace(metadata.originalTimezone)) {
            return Promise.reject(new Error('null or whitespace for original timezone value :' + metadata.originalTimezone));
        }

        metadata.providerName = this.identifier.provider;
        metadata.marketDataName = this.identifier.name;
        if (this._entity != null) {
            throw new Error("Actual Time Series is already registered " + this._entity.marketDataId)
        }

        this._entity = (await this._marketDataService.MarketData.RegisterMarketData(metadata)).data;
        this.metaData = new MarketDataMetadata(this._entity);
    }

    isRegistered(): boolean {
        if (this.metaData != null) {
            return true;
        }
        else {
            this.load();
            if (this.metaData != null) {
                return true;
            }
            return false;
        }
    }

    async load() {
        this._entity = (await this._marketDataService.MarketData.ReadMarketDataRegistry(this.identifier)).data;

        if (this._entity != null) {
            this.metaData = new MarketDataMetadata(this._entity);
        }
    }

    async update() {
        if (this._entity == null) {
            throw new Error("Market Data is not yet registered");
        }

        this._entity = (await this._marketDataService.MarketData.UpdateMarketData({
            marketDataId: this._entity.marketDataId,
            providerName: this._entity.providerName,
            marketDataName: this._entity.marketDataName,
            originalGranularity: this._entity.originalGranularity,
            type: this._entity.type,
            originalTimezone: this._entity.originalTimezone,
            aggregationRule: this._entity.aggregationRule,
        })).data;

        this.metaData = new MarketDataMetadata(this._entity);
    }

    editActual(marketData:MarketData) {
        if (this._entity == null) {
            throw new Error("Actual Time Series is not yet registered");
        }
        if (this._entity.type != MarketDataType.ActualTimeSerie) {
            throw new Error("Entity is not an Actual Time Serie");
        }

        var actual = new ActualTimeSerie(marketData);
    
        return actual;
    }

    editVersioned(marketData: MarketData,version: Date) {
        if (this._entity == null) {
            throw new Error("Versioned Time Series is not yet registered");
        }
        if (this._entity.type != MarketDataType.VersionedTimeSerie) {
            throw new Error("Entity is not a Versioned Time Serie");
        }

        var versioned = new VersionedTimeSerie(marketData);
        versioned.SetSelectedVersion(version);
        return versioned;
    }

    editMarketAssessment(marketData: MarketData) {
        if (this._entity == null) {
            throw new Error("Market Assessment is not yet registered");
        }
        if (this._entity.type != MarketDataType.MarketAssessment) {
            throw new Error("Entity is not a Market Assessment");
        }

        var mas = new MarketAssessment(marketData);
        return mas;
    }

}