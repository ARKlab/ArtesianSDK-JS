import { Granularity } from "../../Data/Enums";

export type Input = {
  marketDataId: number;
  eTag: string;
  providerName: string;
  marketDataName: string;
  originalGranularity: Granularity;
  type: MarketDataType;
  originalTimezone: string;
  aggregationRule: AggregationRule;
  transformId?: number;
  providerDescription: string;
  tags: Record<string, string[]>;
  path?: string;
};
export type Output = Input & {
  transform: TimeTransform;
  lastUpdated: Date;
  dataLastWritedAt?: Date;
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  created: Date;
};

export type TimeTransform = {
  id: number;
  name: string;
  eTag: string;
  definedBy: TransformDefinitionType;
  type: TransformType;
};
enum MarketDataType {
  ActualTimeSerie,
  VersionedTimeSerie,
  MarketAssessment
}
enum AggregationRule {
  Undefined,
  SumAndDivide,
  AverageAndReplicate
}

enum TransformDefinitionType {
  User,
  System
}
enum TransformType {
  SimpleShift,
  Calendar,
  Composition
}
