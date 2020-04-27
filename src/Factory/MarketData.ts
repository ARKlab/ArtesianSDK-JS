import { AuctionTimeSerie } from './AuctionTimeSerie';
import { MarketDataService } from "../Service/MarketData/MarketDataService";
import {
  Output,
  Input,
  MarketDataType
} from "../Service/MarketData/Data/MarketDataEntity";
import { MarketDataIdentifier } from "../Service/MarketData/MarketDataService.MarketData";
import { MarketDataMetadata } from "./MarketDataMetadata";
import { ActualTimeSerie } from "./ActualTimeSerie";
import { MarketAssessment } from "./MarketAssessment";
import { VersionedTimeSerie } from "./VersionedTimeSerie";
import { isNullOrWhitespace } from "../Data/Enums";

export class MarketData {
  _marketDataService: MarketDataService;
  _entity: Output;

  _marketDataId?: number;
  get marketDataId(): number | undefined {
    return this._entity.MarketDataId;
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
      throw new Error("Parameter null exception");
    }
    this._marketDataService = marketDataService;
    this.identifier = id;
  }

  isTrue(conditionOne: boolean, conditionTwo: boolean): boolean {
    if (conditionOne == true || conditionTwo == true) 
    {
      return true;
    }
    return false;
  }

  async Register(metadata: Input): Promise<void> {
    if (metadata == null) {
      return Promise.reject(new Error("" + metadata));
    }
    if (
      !this.isTrue(
        metadata.ProviderName == null,
        metadata.ProviderName == this.identifier.provider
      )
    ) {
      return Promise.reject(new Error("" + metadata.ProviderName));
    }
    if (
      !this.isTrue(
        metadata.MarketDataName == null,
        metadata.MarketDataName == this.identifier.name
      )
    ) {
      return Promise.reject(new Error("" + metadata.ProviderName));
    }

    if (isNullOrWhitespace(metadata.OriginalTimezone)) {
      return Promise.reject(
        new Error(
          "null or whitespace for original timezone value :" +
            metadata.OriginalTimezone
        )
      );
    }

    metadata.ProviderName = this.identifier.provider;
    metadata.MarketDataName = this.identifier.name;
    if (this._entity != null) {
      throw new Error(
        "Actual Time Series is already registered " + this._entity.MarketDataId
      );
    }

    this._entity = (await this._marketDataService.MarketData.RegisterMarketData(
      metadata
    ));
    this.metaData = new MarketDataMetadata(this._entity);
  }

  async isRegistered() {
    if (this.metaData != null) {
      return true;
    } else {
      await this.load();
      if (this.metaData != null) {
        return true;
      }
      return false;
    }
  }

  async load() {
    //@ts-ignore
    var gimme = (await this._marketDataService.MarketData.ReadMarketDataRegistry(
      this.identifier
    ))
    this._entity = (await this._marketDataService.MarketData.ReadMarketDataRegistry(
      this.identifier
    ));

    if (this._entity != null) {
      this.metaData = new MarketDataMetadata(this._entity);
    }
  }

  async update() {
    if (this._entity == null) {
      throw new Error("Market Data is not yet registered");
    }

    this._entity = (await this._marketDataService.MarketData.UpdateMarketData({
      MarketDataId: this._entity.MarketDataId,
      ProviderName: this._entity.ProviderName,
      MarketDataName: this._entity.MarketDataName,
      OriginalGranularity: this._entity.OriginalGranularity,
      Type: this._entity.Type,
      OriginalTimezone: this._entity.OriginalTimezone,
      AggregationRule: this._entity.AggregationRule
    }));

    this.metaData = new MarketDataMetadata(this._entity);
  }

  editActual(marketData: MarketData) {
    if (this._entity == null) {
      throw new Error("Actual Time Series is not yet registered");
    }
    if (this._entity.Type != MarketDataType.ActualTimeSerie) {
      throw new Error("Entity is not an Actual Time Serie");
    }

    var actual = new ActualTimeSerie(marketData);

    return actual;
  }

  editVersioned(marketData: MarketData, version: Date) {
    if (this._entity == null) {
      throw new Error("Versioned Time Series is not yet registered");
    }
    if (this._entity.Type != MarketDataType.VersionedTimeSerie) {
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
    if (this._entity.Type != MarketDataType.MarketAssessment) {
      throw new Error("Entity is not a Market Assessment");
    }

    var mas = new MarketAssessment(marketData);
    
    return mas;
  }

  editAuction(marketData: MarketData) {
    if (this._entity == null) {
      throw new Error("Auction Time Series is not yet registered");
    }
    if (this._entity.Type != MarketDataType.AuctionTimeSerie) {
      throw new Error("Entity is not an Auction Time Serie");
    }

    var auction = new AuctionTimeSerie(marketData);

    return auction;
  }
}
