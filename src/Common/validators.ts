import { AuctionBids } from './../Factory/AuctionTimeSerie';
import { Input, MarketDataType, AggregationRule } from './../Service/MarketData/Data/MarketDataEntity';
import { CustomFilter } from './../Service/MarketData/MarketDataService.CustomFilter';
import { CharacterValidatorRegEx } from './../Data/Constants';
import { isNullOrWhitespace } from '../Data/Enums';
import { SearchFilter } from '../Service/MarketData/MarketDataService.SearchFacet';
import { UpsertCurveData, MarketAssessmentValue } from '../Service/MarketData/MarketDataService.UpsertCurve';


/**
 * Is valid provider
 * @param provider 
 * @param minLength 
 * @param maxLength 
 */
export const isValidProvider = (provider:string, minLength: number, maxLength: number) => {
    isValidString(provider, minLength, maxLength);
}
/**
 * Is valid string checks to see if the string provided is between the provided min and max length
 * @param validStringCheck 
 * @param minLength 
 * @param maxLength 
 */
export const isValidString = (validStringCheck: string, minLength: number, maxLength: number) => {
    if(typeof validStringCheck ==='undefined' || !validStringCheck){
        throw new Error("provider null or empty exception")
     }
     if(validStringCheck.length < minLength || validStringCheck.length > maxLength){
         throw new Error("Provider must be between 1 and 50 characters.")
     }
     if(CharacterValidatorRegEx.test(validStringCheck)){
        throw new Error("Invalid string. Should not contain trailing or leading whitespaces or any of the following characters: ,:;'\"<space>");
     }
}
/**
 * Is valid Market Data name
 * @param name 
 * @param minLength 
 * @param maxLength 
 */
export const isValidMarketDataName = (name: string, minLength: number, maxLength: number) => {
    if(typeof name ==='undefined' || !name){
        throw new Error("Market data name null or empty exception")
     }
     if(name.length < minLength || name.length > maxLength){
        throw new Error("Market data name must be between 1 and 250 characters.")
    }
    if(CharacterValidatorRegEx.test(name)){
       throw new Error("Invalid string Market Data Name. Should not contain trailing or leading whitespaces or any of the following characters: ,:;'\"<space>");
    }
}
/**
 * Validate customFilter
 * @param customFilter 
 */
export const validateCustomFilter = (customFilter: CustomFilter) => {
    if(isNullOrWhitespace(customFilter.name)){
        throw new Error("Custom Filter Name must be valorized");
    }

    if(isNullOrWhitespace(customFilter.searchText) && customFilter.filters == null){
        throw new Error("Either filter text or filter key values must be provided.");
    }
}
/**
 * Validation for registration of marketDataEntity Input
 * @param marketDataEntityInput 
 */
export const validateRegisterMarketDataEntity = (marketDataEntityInput: Input) => {
    if(marketDataEntityInput.marketDataId != 0){
        throw new Error("MarketDataId must be 0");
    }

    if(marketDataEntityInput.type == MarketDataType.MarketAssessment && marketDataEntityInput.transformId != null){
        throw new Error("No transform possible when Type is MarketAssessment");
    }
}
/**
 * Validation for updating a marketDataEntity Input
 * @param marketDataEntityInput 
 */
export const validateUpdateMarketDataEntity = (marketDataEntityInput: Input) => {
    if(marketDataEntityInput.type == MarketDataType.MarketAssessment && marketDataEntityInput.transformId != null){
        throw new Error("No transform possible when Type is MarketAssessment");
    }
    
    if(marketDataEntityInput.type == MarketDataType.MarketAssessment && marketDataEntityInput.aggregationRule != AggregationRule.Undefined){
        
        throw new Error("Aggregation Rule must be Undefined if Type is MarketAssessment");
    }
}
/**
 * Validate searchFilter
 * @param searchFilter 
 */
export const validateSearchFilter = (searchFilter: SearchFilter) => {
    var validSorts = /^(MarketDataId|ProviderName|MarketDataName|OriginalGranularity|Type|OriginalTimezone|Created|LastUpdated)( (asc|desc))?$/;

    if(searchFilter.sorts != null)
    {
        searchFilter.sorts.forEach(element => {
            if(!validSorts.test(element)){
                throw new Error("Invalid search params. Provide a valid sort");
            }
        });
    }

    if(searchFilter.pageSize <= 0){
        throw new Error("Page size should be greater than 0");
    }

    if(searchFilter.page <= 0){
        throw new Error("Page should be greater than 0");
    }

    if(searchFilter.filters != null){
        for(let key in searchFilter.filters){
            let value = searchFilter.filters[key];
            isValidString(key,3,50);
            
            if(value != null){

                if(key != "MarketDataName"){
                    value.forEach(element => {
                        isValidString(element,1,50);
                    });
                }
            else if(key == "MarketDataName"){
                value.forEach(element => {
                    isValidString(element,1,250);
                });
            }
        }
        }
    }
}
/**
 * Validate UpsertCurveData
 * @param upsertCurveData 
 */
export const validateUpsertCurveData = (upsertCurveData:UpsertCurveData) => {
    if(upsertCurveData.id == null){
        throw new Error("UpsertCurveData ID must be valorized");
    }

    //Open issue for IANA support for Date-fns
    //nodatime timezone check tzdb 
    // if (upsertCurveData.timezone != null && DateTimeZoneProviders.Tzdb.GetZoneOrNull(upsertCurveData.timezone) == null)
    //             throw new Error("UpsertCurveData Timezone must be in IANA database if valorized");

    if(upsertCurveData.downloadedAt == null){
        throw new Error("UpsertCurveData DownloadedAt must be valorized");
    }

    if(upsertCurveData.rows == null)
    {
        if(upsertCurveData.version != null)
            throw new Error("UpsertCurveData Version must be NULL if Rows are NULL");
        
        if((upsertCurveData.marketAssessment == null || countMarketAssessments(upsertCurveData.marketAssessment) == 0) && (upsertCurveData.auctionRows == null || countAuctionRows(upsertCurveData.auctionRows) == 0))
            throw new Error("UpsertCurveData MarketAssessment/Bids must be valorized if Rows are NULL");
    }
    else
    {
        if (upsertCurveData.marketAssessment != null)
            throw new Error("UpsertCurveData MarketAssessment must be NULL if Rows are Valorized");

        if (upsertCurveData.auctionRows != null)
            throw new Error("UpsertCurveData Bids must be NULL if Rows are Valorized");

        if(upsertCurveData.rows != undefined){
            var iterator = upsertCurveData.rows.keys();

            while(iterator.next().done != true){
                
                if(iterator.next().value == new Date()){
                    throw new Error(`Rows[${iterator}]Invalid timepoint`);
                }
            }
        }
    }

    if(upsertCurveData.marketAssessment == null)
    {
        if ((upsertCurveData.rows == null || upsertCurveData.rows.size == 0) && (upsertCurveData.auctionRows == null || countAuctionRows(upsertCurveData.auctionRows) == 0))
            throw new Error("UpsertCurveData Rows/Bids must be valorized if MarketAssesment are NULL");
    }
    else
    {
        if (upsertCurveData.rows != null)
            throw new Error("UpsertCurveData Rows must be NULL if MarketAssessment are Valorized");

        if (upsertCurveData.auctionRows != null)
            throw new Error("UpsertCurveData Bids must be NULL if MarketAssessment are Valorized");
    }

    if (upsertCurveData.auctionRows == null)
    {
        if ((upsertCurveData.rows == null || upsertCurveData.rows.size == 0) && (upsertCurveData.marketAssessment == null || countMarketAssessments(upsertCurveData.marketAssessment) == 0))
            throw new Error("UpsertCurveData Rows/MarketAssessment must be valorized if Bids are NULL");
    }
    else
    {
        if (upsertCurveData.rows != null)
            throw new Error("UpsertCurveData Rows must be NULL if Bids are Valorized");

        if (upsertCurveData.marketAssessment != null)
            throw new Error("UpsertCurveData MarketAssesment must be NULL if Bids are Valorized");
    }
}
/**
 * Count of MarketAssessments
 * @param record 
 */
export const countMarketAssessments = (record: Record<string, Record<string,MarketAssessmentValue>>) => {
    var count = 0;

    for(let key in record){
        //key needs to be defined to avoid not referenced error
        key;

        count++;
    }
  
    return count;
}
/**
 * Count of AuctionRows
 * @param record 
 */
export const countAuctionRows = (record: Map<Date, AuctionBids>) => {
    var count = 0;

    for(let key of record){
        //key needs to be defined to avoid not referenced error
        key;

        count++;
    }
    
    return count;
}

