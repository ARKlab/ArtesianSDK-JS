import * as moxios from "moxios";
import { QueryService } from "../../src";
import { Granularity } from "../../src/Data/Enums";

moxios.install();
moxios.stubRequest(/.*/, { response: [] });

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};
const qs = QueryService.FromApiKey(cfg);
qs.CreateActual()
  .ForMarketData([100000001])
  .InGranularity(Granularity.Day)
  .InAbsoluteDateRange(new Date("2018-1-1"), new Date("2018-1-10"))
  .Execute()
  .then(
    () => console.log(moxios.requests),
    err => expect(err).toBe("Granularity is required")
  );
