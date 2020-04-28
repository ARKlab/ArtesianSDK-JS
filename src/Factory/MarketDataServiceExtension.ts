import { MarketDataIdentifier } from "./../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import { MarketDataService } from "../Service/MarketData/MarketDataService";

export class MarketDataServiceExtensions {
  constructor(public marketDataService: MarketDataService) {}

  getMarketDataReference(id: MarketDataIdentifier): MarketData {
    return new MarketData(this.marketDataService, id);
  }
}
