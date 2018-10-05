import 'es6-promise/auto';
import * as QueryService from "./Query/QueryService";
import { Granularity, RelativeIntervalType } from "./Query/Data/Query";

var qs = QueryService.FromApiKey({
  baseUrl: "https://arkive.artesian.cloud/ArkDemo/query/v1.0/",
  key:
    "lyE0ATcZoQaz4mem_IDuP-zhkN65uWjNqvJb-32alkxuaD15tn162HBn-jQzZirRtMIIdDnHSpJrMFHgYBMHhoXjthcbnDBD4fBN7sbq_tnN-Wa5cvaXWjwE1lb7mMgP"
});

qs.CreateActual()
  .InGranularity(Granularity.Hour)
  .ForMarketData([100000492, 100000495])
  .InRelativeInterval(RelativeIntervalType.RollingMonth)
  .execute()
  .then(console.log)
  .catch(console.log);

qs.CreateVersioned()
  .InGranularity(Granularity.Month)
  .ForMarketData([100000001])
  .InRelativeInterval(RelativeIntervalType.RollingMonth)
  .ForLastOfDays(new Date("2018-02-01"), new Date("2018-02-08"))
  .execute()
  .then(console.log);

// qs.CreateMas()
//   .ForProducts(["M+1"])
//   .ForMarketData([100000001])
//   .InRelativeInterval(RelativeIntervalType.RollingMonth)
//   .execute()
//   .then(console.log)
//   .catch(console.log);
