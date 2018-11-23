import { PrincipalType } from './../../src/Metadata/Acl';
import { TransformDefinitionType, TransformType, MarketDataType, AggregationRule } from './../../src/Metadata/Data/MarketData';
import * as moxios from "moxios";
import { MetadataService } from "../../src";
import { getMoxiosUrl } from "../helpers";
import { Granularity } from '../../src/Data/Enums';
import { OperationType } from '../../src/Metadata/Operations';


const cfg = {
    baseUrl: "https://fake-artesian-env",
    key: "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
  };

  const mds = MetadataService.FromApiKey(cfg);

  describe("MetaDataQueries", () => {
      beforeEach(() => {
          moxios.install();
          moxios.stubRequest(/.*/,{response: [] });
      });
      afterEach(() => {
          moxios.uninstall();
      });
      //#region Marketdata
      test("Read Provider by Curve Name", () => 
        mds
            .MarketData.ReadMarketDataRegistry({
                provider: "TestProvider",
                name: "TestCurveName"
            })
            .then( () => { 
                expect(getMoxiosUrl()).toMatchObject({
                    qs: {provider: "TestProvider", curveName: "TestCurveName"}
                });
            })
      );
      test("Read Provider by Curve Id", () => 
        mds
            .MarketData.ReadMarketDataRegistryById(100000001)
            .then( () => {
                expect(getMoxiosUrl()).toMatchObject({url: "https://fake-artesian-env/v2.1//marketdata/entity/100000001"}
            )})
      );
      test("Read Provider by Curve Range", () => 
        mds
            .MarketData.ReadCurveRange({
                id: 100000001,
                page: 1,
                pageSize: 1,
                product: "M+1",
                versionFrom: new Date(2018,7,19,12,0),
                versionTo: new Date(2017,7,19,12,0)
            })
            .then( () => {
                expect(getMoxiosUrl()).toMatchObject({
                    qs: { 
                     page: "1",
                     pageSize: "1",
                     product: "M+1",
                     versionFrom: "Sun Aug 19 2018 12:00:00 GMT+0100 (Irish Standard Time)",
                     versionTo: "Sat Aug 19 2017 12:00:00 GMT+0100 (Irish Standard Time)"
                }})
            })
      );
      test("Register Market Data", () =>
        mds
            .MarketData.RegisterMarketData({
                marketDataId: 100000001,
                providerName: "TestProvider",
                marketDataName: "TestMarketData",
                originalGranularity: Granularity.Day,
                type: MarketDataType.VersionedTimeSerie,
                originalTimezone: "CET",
                aggregationRule: AggregationRule.Undefined,
            })
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
            ).toEqual(["marketdata", "entity"])
                expect(getMoxiosUrl().method)
            .toEqual("post")
            })
      )

      test("Update Market Data", () =>
        mds
            .MarketData.UpdateMarketData({
                marketDataId: 1,
                providerName: "TestProvider",
                marketDataName: "TestMarketData",
                originalGranularity: Granularity.Day,
                type: MarketDataType.VersionedTimeSerie,
                originalTimezone: "CET",
                aggregationRule: AggregationRule.Undefined,
            })
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-3)
            ).toEqual(["marketdata", "entity", "1"])
                expect(getMoxiosUrl().method)
            .toEqual("put")
            })
      )

      test("Delete Market Data", () =>
            mds
                .MarketData.DeleteMarketData(1)
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-3)
                ).toEqual(["marketdata", "entity", "1"])
                    expect(getMoxiosUrl().method)
                .toEqual("delete")
                })
      );
      //#endregion

      //#region SearchFacet
        test("Search Facet", () =>
            mds
                .SearchFacet.Search({
                    page: 1,
                    pageSize: 1,
                    searchText: "testText",
                    sorts: undefined,
                    filters: {"TestKey" : ["TestValue"]}
                })
                .then( () => {
                    expect(getMoxiosUrl()).toMatchObject({
                        qs: {
                            page: "1",
                            pageSize: "1",
                            searchText: "testText"
                        }
                    })
                })
        );
      //#endregion
      //toBeCompleted
      //#region Operations
        test("Operations Perform operations enable", () =>
            mds
                .Operations.PerformOperations({
                    ids : [{
                        id: 1,
                        eTag: "provaEtag"
                    }],
                    operationList: [{
                        params : {
                            tagKey: "Pippo",
                            tagValue: "Valore"
                        },
                        type : OperationType.EnableTag
                    }]
                })
                .then( () =>{
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                    ).toEqual(["marketdata", "operations"])
                    expect(getMoxiosUrl().method)
                    .toEqual("post")
                })
        );

        test("Operations Perform operations disable", () =>
            mds
                .Operations.PerformOperations({
                    ids : [{id: 0, eTag: "provaEtag"}],
                    operationList: [{
                        params : {
                            tagKey: "Pippo",
                            tagValue: "Valore"
                        },
                        type : OperationType.DisableTag
                    }]
                })
                .then( () =>{
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                    ).toEqual(["marketdata", "operations"])
                    expect(getMoxiosUrl().method)
                    .toEqual("post")
                })
        );
      //#endregion

      //#region UpsertCurve
        test("Upsert Curve Data versioned", () =>
            mds
                .UpsertCurve.UpsertCurevData({
                    id: {provider: "TestProviderName",name: "TestCurveName"},
                    version: new Date(2018,8,19,12,0,0,123),
                    timezone: "CET",
                    downloadedAt: new Date(),
                    rows: {"Sun Aug 19 2018 12:00:00 GMT+0100 (Irish Standard Time" : 21.4},
                    deferCommandExecution: false,
                    deferDataGeneration: true
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["marketdata", "upsertdata"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        );

        test("Upsert Curve Data", () =>
            mds
                .UpsertCurve.UpsertCurevData({
                    id: {provider: "TestProviderName",name: "TestCurveName"},
                    timezone: "CET",
                    downloadedAt: new Date(),
                    marketAssessment: {"2018-4-5" : { }}
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["marketdata", "upsertdata"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        );
      //#endregion

      //#region TimeTransform
        test("Read Time Transform by Id", () =>
         mds
             .TimeTransform.GetById(1)
             .then( () => {
                 expect(getMoxiosUrl().url.split("/")
                 .slice(-2)
                 ).toEqual(["entity","1"])
             })
        )
        
        test("Read Time Transform", () =>
             mds
                .TimeTransform.Get(
                    1,1,true
                )
                .then( () => {
                    expect(getMoxiosUrl()).toMatchObject({
                        qs: {
                            page: "1",
                            pageSize: "1",
                            userDefined: "true"
                        }
                    })
                })
        )

        test("Read Time Transform with headers", () =>
             mds
                .TimeTransform.Get(
                    1,1,true
                )
                .then( () => {
                    expect(getMoxiosUrl()).toMatchObject({
                        headers: {
                            "Accept" : "application/json, text/plain, */*",
                            "x-api-key" : "5418B0DB-7AB9-4875-81BA-6EE609E073B6"
                        }
                    })
                })
        )


        test("Register Time Transform ", () =>
            mds
                .TimeTransform.Create({
                    id: 1,
                    name: "TimeTName",
                    eTag: "00000000-0000-0000-0000-000000000000",//eTag Guid.Empty
                    definedBy: TransformDefinitionType.System,
                    type: TransformType.SimpleShift
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["timetransform", "entity"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        )

        test("Update Time Transform ", () =>
            mds
                .TimeTransform.Update({
                    id: 1,
                    name: "TimeTName",
                    eTag: "00000000-0000-0000-0000-000000000000",
                    definedBy: TransformDefinitionType.User,
                    type: TransformType.SimpleShift
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-3)
                ).toEqual(["timetransform", "entity", "1"])
                    expect(getMoxiosUrl().method)
                .toEqual("put")
                })
        )

        test("Delete Time Transform ", () =>
            mds
                .TimeTransform.Delete(1)
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-3)
                ).toEqual(["timetransform", "entity", "1"])
                    expect(getMoxiosUrl().method)
                .toEqual("delete")
                })
        )
      //#endregion

      //#region Custome Filter
        test("Create Filter", () =>
            mds
                .CustomFilter.Create({
                    id: 1,
                    name: "TestName",
                    searchText: "Text"
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-1)
                ).toEqual(["filter"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        )

        test("Update Filter", () =>
            mds
                .CustomFilter.Update(1,{
                    id: 1,
                    name: "TestName",
                    searchText: "Text",
                })
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["filter","1"])
                    expect(getMoxiosUrl().method)
                .toEqual("put")
                })
        )

        test("Remove Filter", () =>
            mds
                .CustomFilter.Delete(1)
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["filter","1"])
                    expect(getMoxiosUrl().method)
                .toEqual("delete")
                })
        )

        test("Read Filter by id", () =>
            mds
                .CustomFilter.GetById(1)
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["filter","1"])
                    expect(getMoxiosUrl().method)
                .toEqual("get")
                })
        )

        test("Read Filters", () =>
            mds
                .CustomFilter.Get(1,1)
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-1)
                ).toEqual(["filter"])
                    expect(getMoxiosUrl().method)
                .toEqual("get")
                })
        )
      //#endregion

      //#region ACL
        test("Read Roles by Path", () =>
         mds
            .Acl.ReadRolesByPath(
                "path1"
            )
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
                ).toEqual(["me","path1"])
            })
        )

        test("Get Roles", () =>
            mds
                .Acl.GetRoles(
                    1,1,["principles"],null
                )
                .then( () => {
                    expect(getMoxiosUrl()).toMatchObject({
                        qs: {
                            page: "1",
                            pageSize: "1",
                            principalIds: "principles",
                        }
                    })
                })
        )

        test("Add Roles", () =>
            mds
                .Acl.AddRoles({
                   path:  "",
                   roles: [{
                       role: "Role",
                       inherritedFrom: "InheritedFrom",
                       principal: {
                           principalType: PrincipalType.User,
                           principalId: "ID"
                       }
                   }] 
                }
                )
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["acl", "roles"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        )

        test("Upsert Roles", () =>
            mds
                .Acl.UpsertRoles({
                   path:  "",
                   roles: [{
                       role: "Role",
                       inherritedFrom: "InheritedFrom",
                       principal: {
                           principalType: PrincipalType.User,
                           principalId: "ID"
                       }
                   }] 
                }
                )
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-1)
                ).toEqual(["acl"])
                    expect(getMoxiosUrl().method)
                .toEqual("post")
                })
        )

        test("Remove Roles", () =>
            mds
                .Acl.RemoveRoles({
                   path:  "",
                   roles: [{
                       role: "Role",
                       inherritedFrom: "InheritedFrom",
                       principal: {
                           principalType: PrincipalType.User,
                           principalId: "ID"
                       }
                   }] 
                }
                )
                .then( () => {
                    expect(getMoxiosUrl().url.split("/")
                    .slice(-2)
                ).toEqual(["acl", "roles"])
                    expect(getMoxiosUrl().method)
                .toEqual("delete")
                })
        )
      //#endregion
      
      //#region Admin
      test("Create Auth Group", () =>
        mds
            .Admin.CreateAuthGroup({
                id: 1,
                name: "AuthGroupTest",
                eTag: undefined,
                users: undefined
            })
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-1)
            ).toEqual(["group"])
                expect(getMoxiosUrl().method)
            .toEqual("post")
            })
      )

      test("Update Auth Group", () =>
        mds
            .Admin.UpdateAuthGroup(1,{
                id: 1,
                name: "AuthGroupTest"
            })
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
            ).toEqual(["group","1"])
                expect(getMoxiosUrl().method)
            .toEqual("put")
            })
      )

      test("Remove Auth Group", () =>
        mds
            .Admin.RemoveAuthGroup(1)
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
            ).toEqual(["group","1"])
                expect(getMoxiosUrl().method)
            .toEqual("delete")
            })
      )

      test("Read Auth Group by Id", () =>
      mds
          .Admin.ReadAuthGroup(1)
          .then( () => {
              expect(getMoxiosUrl().url.split("/")
              .slice(-2)
          ).toEqual(["group","1"])
              expect(getMoxiosUrl().method)
          .toEqual("get")
          })
        )

        test("Read Auth Group by Id", () =>
        mds
            .Admin.ReadAuthGroups(1,1)
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-1)
            ).toEqual(["group"])
                expect(getMoxiosUrl().method)
            .toEqual("get")
            })
        )
      //#endregion

      //#region ApiKey

      test("Create Api key", () =>
        mds
            .ApiKey.Create({
                id: 0
            })
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
                ).toEqual(["apikey", "entity"])
                expect(getMoxiosUrl().method)
                .toEqual("post")
            })
      )

      test("Read Api key by Id", () =>
        mds
            .ApiKey.GetById(1)
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-3)
                ).toEqual(["apikey", "entity","1"])
                expect(getMoxiosUrl().method)
                .toEqual("get")
            })
      )

      test("Read Api key by Key", () =>
        mds
            .ApiKey.GetByKey("testKey")
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
                ).toEqual(["apikey", "entity"])
                expect(getMoxiosUrl().method)
                .toEqual("get")
            })
      )

      test("Read Api key by userId", () =>
        mds
            .ApiKey.GetByUserId(1,1,"testName")
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-2)
                ).toEqual(["apikey", "entity"])
                expect(getMoxiosUrl().method)
                .toEqual("get")
            })
      )

      test("Delete Api key", () =>
        mds
            .ApiKey.Delete(1)
            .then( () => {
                expect(getMoxiosUrl().url.split("/")
                .slice(-3)
                ).toEqual(["apikey", "entity","1"])
                expect(getMoxiosUrl().method)
                .toEqual("delete")
            })
      )

      //#endregion
  
    });