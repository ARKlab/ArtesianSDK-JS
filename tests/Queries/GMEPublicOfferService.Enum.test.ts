import { GMEPublicOfferService } from "../../src";
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};

const pos = GMEPublicOfferService.FromApiKey(cfg);

describe("GMEPublicOfferServiceMetadata", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  //#region Metadata
  test("Read operators", () =>
    pos.Enum.GetOperators({
      page: 10,
      pageSize: 100,
      operatorFilter: 'jim',
      sort: ['id asc']
    }).then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        qs: { page: '10', pageSize: '100', operatorFilter: 'jim', sort: 'id asc' }
      })
    }));
    test("Read units", () =>
    pos.Enum.GetUnits({
      page: 2,
      pageSize: 4,
      unitFilter: 'bill',
      sort: ['id desc']
    }).then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        qs: { page: '2', pageSize: '4', unitFilter: 'bill', sort: 'id desc' }
      });
    }));
});
