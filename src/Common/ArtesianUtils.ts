import * as R from "ramda";
import { Granularity, TimePeriod, DatePeriod } from "./../Data/Enums";

/**
 * Returns true if the given Granularity is by time
 * @param granularity
 */
export function IsTimeGranularity(granularity: Granularity): boolean {
  return IsPartOf(granularity, Granularity.Day);
}

/**
 * Mapping the Time Period based on Granularity
 * @param granularity
 */
export function MapTimePeriod(granularity: Granularity): TimePeriod {
  if (!IsTimeGranularity(granularity)) {
    throw new Error("Not a time granularity: " + granularity);
  }
  var selectedPeriod = TimePeriod.Hour;

  switch (granularity) {
    case Granularity.Hour: {
      selectedPeriod = TimePeriod.Hour;
      break;
    }
    case Granularity.ThirtyMinute: {
      selectedPeriod = TimePeriod.HalfHour;
      break;
    }
    case Granularity.FifteenMinute: {
      selectedPeriod = TimePeriod.QuarterHour;
      break;
    }
    case Granularity.TenMinute: {
      selectedPeriod = TimePeriod.TenMinutes;
      break;
    }
    case Granularity.Minute: {
      selectedPeriod = TimePeriod.Minute;
      break;
    }
  }
  return selectedPeriod;
}
/**
 * Mapping the Date Period based on Granularity
 * @param granularity
 */
export function MapDatePeriod(granularity: Granularity): DatePeriod {
  var selectedPeriod = DatePeriod.Day;

  switch (granularity) {
    case Granularity.Week: {
      selectedPeriod = DatePeriod.Week;
      break;
    }
    case Granularity.Month: {
      selectedPeriod = DatePeriod.Month;
      break;
    }
    case Granularity.Quarter: {
      selectedPeriod = DatePeriod.Trimestral;
      break;
    }
    case Granularity.Year: {
      selectedPeriod = DatePeriod.Calendar;
      break;
    }
  }

  return selectedPeriod;
}
/**
 * Returns true if the smaller granularity is part of the biggest granularity
 * @param smaller
 * @param bigger
 */
function IsPartOf(smaller: Granularity, bigger: Granularity): boolean {
  if (bigger == Granularity.Week)
    return smaller == Granularity.Day || IsPartOf(smaller, Granularity.Day);
  if (smaller == Granularity.Week) return false;
  return _orderOf(smaller) < _orderOf(bigger);
}
/**
 * Gives the number of minutes based on Granularity
 * @param granularity
 */
function _orderOf(granularity: Granularity): number {
  switch (granularity) {
    case Granularity.Minute:
      return 1;
    case Granularity.TenMinute:
      return 10;
    case Granularity.FifteenMinute:
      return 15;
    case Granularity.ThirtyMinute:
      return 30;
    case Granularity.Hour:
      return 60;
    case Granularity.Day:
      return 1440;
    case Granularity.Week:
      return 10080;
    case Granularity.Month:
      return 43200;
    case Granularity.Quarter:
      return 129600;
    case Granularity.Year:
      return 525600;
  }
  // @ts-ignore
  throw new Error("Granularity : " + granularity + " is not supported");
}

/**
 * Converts to UTC date
 * @param date
 */
export const getUTCDate = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};
/**
 * Set Date's Time to midnight
 * @param date
 */
export const atMidnight = (date: Date) => {
  date.setHours(0),
    date.setMinutes(0),
    date.setSeconds(0),
    date.setMilliseconds(0);
  return date;
};

export type resolver = () => void;

export function createDeferred(): [Promise<void>, resolver, resolver] {
  let resolve = () => {};
  let reject = () => {};
  const prom = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [prom, resolve, reject];
}

const paging = R.uncurryN(3, (size: number) => (page: number) =>
  R.pipe(
    R.drop(page * size),
    R.take(size)
  )
);

const defaultPartition = 25;
export const partitionIds = (
  ids: number[],
  cfg = { partitionSize: defaultPartition }
) => {
  return R.unfold(
    i =>
      ids.length <= i * cfg.partitionSize
        ? false
        : [paging(cfg.partitionSize, i, ids), i + 1],
    0
  );
};
