import { PublicOfferService } from "../../src";
import * as moxios from "moxios";
import { getMoxiosUrl } from "../helpers";
import {
  Purpose,
  Status,
  Scope,
  BAType,
  GenerationType,
  UnitType,
  Zone
} from "../../src/Service/PublicOffer/Data/Enums";

const cfg = {
  baseUrl: "https://fake-artesian-env",
  key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
};

const pos = PublicOfferService.FromApiKey(cfg);

describe("PublicOfferServiceQuery", () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/.*/, { response: [] });
  });
  afterEach(() => {
    moxios.uninstall();
  });
  //#region Metadata
  test("Query with minimal params", () =>
    pos.Query.CreatePublicOfferQuery()
      .ForDate(new Date("2018-1-1"))
      .ForPurpose(Purpose.OFF)
      .ForStatus(Status.REJ)
      .Execute()
      .then(() => {
        expect(getMoxiosUrl()).toMatchObject({
          url:
            "https://fake-artesian-env/gmepublicoffer/v1.0/extract/2018-01-01/1/1"
        });
        expect(getMoxiosUrl().method).toEqual("get");
      }));
  test("Query without required date", () =>
    pos.Query.CreatePublicOfferQuery()
      .ForPurpose(Purpose.OFF)
      .ForStatus(Status.REJ)
      .Execute()
      .then(
        () => Promise.reject("This should fail required date check"),
        err => expect(err).toBe("Date is required")
      ));
  test("Query without required purpose", () =>
    pos.Query.CreatePublicOfferQuery()
      .ForDate(new Date("2018-1-1"))
      .ForStatus(Status.REJ)
      .Execute()
      .then(
        () => Promise.reject("This should fail required purpose check"),
        err => expect(err).toBe("Purpose is required")
      ));
  test("Query without required status", () =>
    pos.Query.CreatePublicOfferQuery()
      .ForDate(new Date("2018-1-1"))
      .ForPurpose(Purpose.OFF)
      .Execute()
      .then(
        () => Promise.reject("This should fail required status check"),
        err => expect(err).toBe("Status is required")
      ));
  test("Query with optional filters", () =>
    pos.Query.CreatePublicOfferQuery()
      .ForDate(new Date("2018-1-1"))
      .ForPurpose(Purpose.OFF)
      .ForStatus(Status.REJ)
      .ForScope([Scope.CA, Scope.GR1])
      .ForBAType([BAType.NETT])
      .ForGenerationType([GenerationType.COAL])
      .ForUnit(['jim', 'bill'])
      .ForUnitType([UnitType.UCV])
      .ForZone([Zone.FRAN])
      .WithPagination(9,99)
      .Execute()
      .then(() => {
        expect(getMoxiosUrl()).toMatchObject({
          qs: { scope: '3,4', baType: '1', generationType: '4', unit: 'jim,bill', unitType: '3', zone: '7', page: '9', pageSize: '99' }
        });
      })); 
});
