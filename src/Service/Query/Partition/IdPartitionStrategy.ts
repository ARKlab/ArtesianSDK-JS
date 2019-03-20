import * as R from "ramda";
import {
  QueryParams,
  CurveSelectionType,
  ActualQueryParams,
  VersionedQueryParams,
  MasQueryParams
} from "../Data/Query";
import { partitionIds } from "../../../Common/ArtesianUtils";
import { queryOptions } from "../../../Data/ArtesianServiceConfig";

export interface IPartitionStrategy {
  Actual: (a: ActualQueryParams[]) => ActualQueryParams[];
  Versioned: (a: VersionedQueryParams[]) => VersionedQueryParams[];
  Mas: (a: MasQueryParams[]) => MasQueryParams[];
}
export function IdPartitionStrategy(cfg: {
  queryOptions?: queryOptions;
}): IPartitionStrategy {
  return {
    Actual: R.chain(expandParams(cfg)),
    Versioned: R.chain(expandParams(cfg)),
    Mas: R.chain(expandParams(cfg))
  };
}

const expandParams = <Params extends QueryParams>(cfg: {
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
