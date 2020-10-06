import { Granularity } from "../../../Data/Enums";
/**
 * The ApiKey Entity Input
 */
export type Input = {
  MarketDataId?: number;
  ETag?: string;
  ProviderName: string;
  MarketDataName: string;
  OriginalGranularity: Granularity;
  Type: MarketDataType;
  OriginalTimezone: string;
  AggregationRule: AggregationRule;
  TransformId?: number;
  ProviderDescription?: string;
  Tags?: Record<string, string[]>;
  Path?: string;
};
/**
 * The ApiKey Entity Output
 */
export type Output = Input & {
  Transform: TimeTransform;
  LastUpdated: Date;
  DataLastWritedAt?: Date;
  DateRangeStart?: Date;
  DateRangeEnd?: Date;
  Created: Date;
};
/**
 * The TimeTransform base entity with Etag
 */
export type TimeTransform = {
  id: number;
  name: string;
  eTag: string;
  definedBy: TransformDefinitionType;
  type: TransformType;
};
/**
 * MarketDataType Enums
 */
export enum MarketDataType {
  ActualTimeSerie = "ActualTimeSerie",
  VersionedTimeSerie = "VersionedTimeSerie",
  MarketAssessment = "MarketAssessment",
  AuctionTimeSerie = "Auction",
  BidAsk = "BidAsk",
}
/**
 * Aggregation Rule Enums
 */
export enum AggregationRule {
  Undefined = "Undefined",
  SumAndDivide = "SumAndDivide",
  AverageAndReplicate = "AverageAndReplicate",
}
/**
 * TransformDefinitionType Enums
 */
export enum TransformDefinitionType {
  User = "User",
  System = "System",
}
/**
 * TransformType Enums
 */
export enum TransformType {
  SimpleShift = "SimpleShift",
  Calendar = "Calendar",
  Composition = "Composition",
}
