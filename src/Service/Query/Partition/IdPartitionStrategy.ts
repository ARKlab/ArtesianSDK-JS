import * as R from "ramda";
import { QueryParams, CurveSelectionType } from "../Data/Query";
import { partitionIds } from "../../../Common/ArtesianUtils";
import { queryOptions } from "../../../Data/ArtesianServiceConfig";

export const IdPartitionStrategy = <Params extends QueryParams>(cfg: {
  queryOptions?: queryOptions;
}) => R.chain<Params, Params>(expandParams(cfg));

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
