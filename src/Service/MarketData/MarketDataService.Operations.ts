import { Output } from "./Data/MarketDataEntity";
import { IService } from "./MarketDataService";

export class Operations {
  constructor(private _client: IService) {
  }
  /**
   *  A sequence of operation will be applied to the metadata identified by ids
   * @param operations 
   * Returns MarketData Entity Output
   */
  PerformOperations(operations: OperationsInput) {
    const url = "marketdata/operations";

    return this._client.post<Output[]>(url, operations);
  }
}

type OperationsInput = {
  ids: MarketDataETag[];
  operationList: OperationParams[];
};

type MarketDataETag = {
  id: number;
  eTag: string;
};

type OperationParams = {
  params: OperationEnableDisableTag;
  type : OperationType;
};

type OperationEnableDisableTag = {
  tagKey : string;
  tagValue : string;
}

export enum OperationType {
  EnableTag = 1,
  DisableTag = 2,
  UpdateAggregationRule = 3,
  UpdateTimeTransformID = 4,
  UpdateOriginalTimeZone = 5,
  UpdateProviderDescription = 6,
}
