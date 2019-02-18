import { Granularity } from "../../../Data/Enums";
/**
 * The ApiKey Entity Input
 */
export type Input = {
  marketDataId?: number;
  eTag?: string;
  providerName: string;
  marketDataName: string;
  originalGranularity: Granularity;
  type: MarketDataType;
  originalTimezone: string;
  aggregationRule: AggregationRule;
  transformId?: number;
  providerDescription?: string;
  tags?: Record<string, string[]>;
  path?: string;
};
/**
 * The ApiKey Entity Output
 */
export type Output = Input & {
  transform: TimeTransform;
  lastUpdated: Date;
  dataLastWritedAt?: Date;
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  created: Date;
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
  ActualTimeSerie,
  VersionedTimeSerie,
  MarketAssessment
}
/**
 * Aggregation Rule Enums
 */
export enum AggregationRule {
  Undefined,
  SumAndDivide,
  AverageAndReplicate
}
/**
 * TransformDefinitionType Enums
 */
export enum TransformDefinitionType {
  User,
  System
}
/**
 * TransformType Enums
 */
export enum TransformType {
  SimpleShift,
  Calendar,
  Composition
}
