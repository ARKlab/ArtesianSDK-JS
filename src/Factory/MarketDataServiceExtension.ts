import { MarketDataIdentifier } from "./../Service/MarketData/MarketDataService.MarketData";
import { MarketData } from "./MarketData";
import { MarketDataService } from "../Service/MarketData/MarketDataService";

export class MarketDataServiceExtensions {
  constructor() {}

  getMarketDataReference(
    marketDataService: MarketDataService,
    id: MarketDataIdentifier
  ): MarketData {
    return new MarketData(marketDataService, id);
  }
}
