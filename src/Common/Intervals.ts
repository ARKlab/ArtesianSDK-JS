import { getUTCDate } from './ArtesianUtils';
import { startOfWeek, startOfMonth, subMinutes, startOfQuarter, startOfYear, getYear, getMonth } from 'date-fns';
import { TimePeriod, DatePeriod } from './../Data/Enums';

/**
 * Check for is start of interval time
 * @param localTime 
 * @param period 
 */
export function IsStartOfIntervalTime(localTime: Date, period: TimePeriod) : boolean
{
  return AtStartOfIntervalTime(localTime, period) == localTime;
}
/**
 * Check for is start of interval date
 * @param localTime
 * @param period 
 */
export function IsStartOfIntervalDate(localTime: Date, period: DatePeriod) : boolean
{
  return AtStartOfIntervalDate(localTime, period) == localTime;
}

function AtStartOfIntervalTime(localTime: Date, period: TimePeriod)
{
  return (subMinutes(getUTCDate(localTime), _offsetFromStart(localTime,period)))
}

function _offsetFromStart(time: Date, period: TimePeriod)
{
    var offset: number = 0;
    // offset += Duration.FromTicks(time.TickOfSecond);
    // offset += Duration.FromMilliseconds(time.Second);
    
    switch (period)
    {
        case TimePeriod.Hour:
            offset += time.getTimezoneOffset();
            break;
        case TimePeriod.Minute:
            break;
        case TimePeriod.TenMinutes:
            offset += (time.getTimezoneOffset() % 10 );
            break;
        case TimePeriod.QuarterHour:
            offset += (time.getTimezoneOffset() % 15 );
            break;
        case TimePeriod.HalfHour:
            offset += (time.getTimezoneOffset() % 30 );
            break;
    }

    return offset;
}

function AtStartOfIntervalDate(date: Date, period: DatePeriod)
{
    switch (period)
    {
        case DatePeriod.Day:
            return date;
        case DatePeriod.Week:
            return firstDayOfTheWeek(date);
        case DatePeriod.Month:
            return firstDayOfTheMonth(date);
        case DatePeriod.Bimestral:
            return new Date(getYear(date), ((getMonth(date) - 1) / 2) * 2 + 1, 1);
        case DatePeriod.Trimestral:
            return firstDayOfTheQuarter(date);
        case DatePeriod.Calendar:
            return firstDayOfTheYear(date);
    }

  return date;
}
/**
 * Returns date as of Monday
 * @param date 
 */
function firstDayOfTheWeek(date: Date){
    //Start of week Monday
    return startOfWeek(date, {weekStartsOn: 1});
}
/**
 * Returns first day of the month
 * @param date 
 */
function firstDayOfTheMonth(date: Date){

    return startOfMonth(date);
}
/**
 * Returns the first day of the quarter
 * @param date 
 */
function firstDayOfTheQuarter(date: Date){

    return startOfQuarter(date);
}
/**
 * Returns the first day of the year
 * @param date 
 */
function firstDayOfTheYear(date: Date){

    return startOfYear(date);
}