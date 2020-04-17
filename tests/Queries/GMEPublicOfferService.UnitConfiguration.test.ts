import { GMEPublicOfferService } from "../../src";
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};

const pos = GMEPublicOfferService.FromApiKey(cfg);

describe("GMEPublicOfferServiceUnitConfiguration", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test("Read unit configuration by id", () =>
    pos.UnitConfiguration.GetById('jim').then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        url: "https://fake-artesian-env/gmepublicoffer/v1.0/unitconfigurationmappings/jim"
      });
      expect(getMoxiosUrl().method).toEqual("get");
    }));
  test("Read unit configuration", () =>
    pos.UnitConfiguration.Get({
      page: 10,
      pageSize: 100,
      unitFilter: 'jim',
      sort: ['id asc']
    }).then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        qs: { page: '10', pageSize: '100', unitFilter: 'jim', sort: 'id asc' }
      })
    }));
  test("Delete unit configuration by id", () =>
    pos.UnitConfiguration.Delete('jim').then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        url: "https://fake-artesian-env/gmepublicoffer/v1.0/unitconfigurationmappings/jim"
      });
      expect(getMoxiosUrl().method).toEqual("delete");
    }));
    test("Upsert unit configuration", () =>
    pos.UnitConfiguration.Upsert({  
      Unit: 'jim',
      ETag: 'abc',
      Mappings: []
    }).then(() => {
      expect(getMoxiosUrl()).toMatchObject({
        url: "https://fake-artesian-env/gmepublicoffer/v1.0/unitconfigurationmappings/jim"
      });
      expect(getMoxiosUrl().method).toEqual("put");
    }));
});
