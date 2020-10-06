import * as R from "ramda";
import {
  QueryParamsWithInterval,
  CurveSelectionType,
  ActualQueryParams,
  AuctionQueryParams,
  VersionedQueryParams,
  MasQueryParams,
  BidAskQueryParams,
  QueryParamsWithRange
} from "../Data/Query";
import { partitionIds } from "../../../Common/ArtesianUtils";
import { queryOptions } from "../../../Data/ArtesianServiceConfig";

export interface IPartitionStrategy {
  Actual: (a: ActualQueryParams[]) => ActualQueryParams[];
  Auction: (a: AuctionQueryParams[]) => AuctionQueryParams[];
  Versioned: (a: VersionedQueryParams[]) => VersionedQueryParams[];
  Mas: (a: MasQueryParams[]) => MasQueryParams[];
  BidAsk: (a: BidAskQueryParams[]) => BidAskQueryParams[];
}
export function IdPartitionStrategy(cfg: {
  queryOptions?: queryOptions;
}): IPartitionStrategy {
  return {
    Actual: R.chain(expandParamsWithInterval(cfg)),
    Auction: R.chain(expandParams(cfg)),
    Versioned: R.chain(expandParamsWithInterval(cfg)),
    Mas: R.chain(expandParamsWithInterval(cfg)),
    BidAsk: R.chain(expandParamsWithInterval(cfg))
  };
}

// !? extends QueryParamsWithInterval
// QueryParamsWithRange
const expandParamsWithInterval = <Params extends QueryParamsWithInterval>(cfg: {
  queryOptions?: queryOptions;
}) => (queryParams: Params) => {
  switch (queryParams.curveSelection.tag) {
    case CurveSelectionType.FilterSelection:
      return [queryParams];
    case CurveSelectionType.IdSelection:
      return partitionIds(queryParams.curveSelection.val, cfg.queryOptions).map(
        group =>
          R.mergeDeepRight(queryParams, { curveSelection: { val: group } })
      );
  }
};

const expandParams = <Params extends QueryParamsWithRange>(cfg: {
  queryOptions?: queryOptions;
}) => (queryParams: Params) => {
  switch (queryParams.curveSelection.tag) {
    case CurveSelectionType.FilterSelection:
      return [queryParams];
    case CurveSelectionType.IdSelection:
      return partitionIds(queryParams.curveSelection.val, cfg.queryOptions).map(
        group =>
          R.mergeDeepRight(queryParams, { curveSelection: { val: group } })
      );
  }
};
