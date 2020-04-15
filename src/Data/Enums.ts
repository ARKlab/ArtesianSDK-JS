/**
 * Granularity Enum
 */
export enum Granularity {
  Hour,
  Day,
  Week,
  Month,
  Quarter,
  Year,
  TenMinute,
  FifteenMinute,
  Minute,
  ThirtyMinute
}
/**
 * DatePeriod Enum
 */
export enum DatePeriod
{
    Day = 2,
    Week = 3,
    Month = 4,
    Bimestral = 5,
    Trimestral = 6,
    Calendar = 7
}
/**
 * TimePeriod Enum
 */
export enum TimePeriod
{
    Hour = 2,
    TenMinutes = 3,
    Minute = 4,
    QuarterHour = 5,
    HalfHour = 6
}
/**
 * SystemTimeTransform Enum
 */
export enum SystemTimeTransform {
  GASDAY66 = 1,
  THERMALYEAR = 2
}
/**
 * AddTimeSerieOperationResult Enum
 */
export enum AddTimeSerieOperationResult
{
    ValueAdded = 0,
    TimeAlreadyPresent = 1
}
/**
 * AddAssessmentOperationResult Enum
 */
export enum AddAssessmentOperationResult
{
    AssessmentAdded = 0,
    ProductAlreadyPresent = 1,
    IllegalReferenceDate = 2
}
/**
 * DayOfWeek Enum
 */
export enum DayOfWeek
{
    None = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}
/**
 * AuctionSide Enum
 */
export enum AuctionSide
{
    Bid = 0,
    Offer = 1
}
/**
 * DateString of type string
 */
export type DateString = string;
/**
 * Is null or Whitespace check
 * @param input 
 */
export function isNullOrWhitespace( input: string ) {
    return !input || input.replace(/\s/g, '').length < 1;
  }


