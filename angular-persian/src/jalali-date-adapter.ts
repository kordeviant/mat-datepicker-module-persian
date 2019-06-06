import {Inject, Optional} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as jMoment from 'moment-jalaali';
import {MAT_DATE_LOCALE} from './injectors';
const minmin: any = jMoment;


export class JalaliMomentDateAdapter extends DateAdapter<jMoment.Moment> {
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string) {
    super();
    this.setLocale(matDateLocale || minmin.locale('fa'));
    minmin.loadPersian();
  }

  invalid() {
    return 'hi' as any;

  }

  toIso8601(date) {
    return 'hi';

  }

  /**
   * returns year in jalali calendar system.
   */
  getYear(date: jMoment.Moment): number {
    return this.clone(date).jYear();
  }

  /**
   * returns month in jalali calendar system.
   */
  getMonth(date: jMoment.Moment): number {
    return this.clone(date).jMonth();
  }

  /**
   * returns day in jalali calendar system.
   */
  getDate(date: jMoment.Moment): number {
    return this.clone(date).jDate();
  }

  /**
   * returns Day Of Week in jalali calendar system.
   */
  getDayOfWeek(date: jMoment.Moment): number {
    return this.clone(date).day();
  }

  /**
   * returns Month Names in jalali calendar system.
   * most of the time we use long format. short or narrow format for month names is a little odd.
   */
  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const r: string[] = [];
    minmin.loadPersian({dialect: 'persian', usePersianDigits: true});
    const l = minmin().localeData();
    if (style === 'long' || style === 'short') {
      Object.keys(l).forEach(key => {
        if (key === '_jMonths') {
          const values = l[key];
          for (let index = 0; index < values.length; index++) {
            r.push(values[index]);
          }
        }
      });
    } else {
      Object.keys(l).forEach(key => {
        if (key === '_jMonthsShort') {
          const values = l[key];
          for (let index = 0; index < values.length; index++) {
            r.push(values[index]);
          }
        }
      });
    }
    return r;
    // switch (style) {
    //     case 'long':
    //         const mlong = (minmin().localeData() as any)._jMonths.slice(0);
    //         console.log(mlong);
    //         return mlong;
    //     case 'short':
    //         const mshort = (minmin().localeData() as any)._jMonthsShort.slice(0);
    //         console.log('mshort: ', mshort);
    //         return mshort;
    //     case 'narrow':
    //         return (minmin().localeData() as any)._jMonthsShort.slice(0);
    // }
  }

  /**
   * borrowed from angular material code.
   */
  getDateNames(): string[] {
    return this.range(31, i => String(i + 1));
  }

  /**
   * returns Day Of Week names in jalali calendar system.
   */
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
        return minmin().localeData().weekdays().slice(0);
      case 'short':
        return minmin().localeData().weekdaysShort().slice(0);
      case 'narrow':
        return minmin().localeData().weekdaysMin().slice(0);
    }
  }

  /**
   * returns year in jalali calendar system.
   */
  getYearName(date: jMoment.Moment): string {
    return this.clone(date).jYear().toString();
  }

  /**
   * returns first day of week in jalali calendar system.
   * first day of week is saturday, شنبه
   */
  getFirstDayOfWeek(): number {
    return 6;
  }

  /**
   * returns Number of Days In Month in jalali calendar system.
   */
  getNumDaysInMonth(date: jMoment.Moment, fa?): number {
    if (date['_d']) {
      return minmin.jDaysInMonth(this.getYear(date['_d']), this.getMonth(date['_d']));
    }
    return minmin.jDaysInMonth(this.getYear(date), this.getMonth(date));
  }

  clone(date: jMoment.Moment): jMoment.Moment {
    // return date.clone().locale(this.locale);
    return minmin(date);
  }

  createDate(year: number, month: number, date: number): jMoment.Moment {
    return minmin().jYear(year).jMonth(month).jDate(date);
  }

  today(): jMoment.Moment {
    return minmin();
  }

  parse(value: any, parseFormat: string | string[]): jMoment.Moment | null {
    if (value && typeof value === 'string') {
      return minmin(value, parseFormat, this.locale);
    }
    return value ? minmin(value).locale(this.locale) : null;
  }

  format(date: jMoment.Moment, displayFormat: any): string {
    return this.clone(date).format(displayFormat);
  }

  addCalendarYears(date: jMoment.Moment, years: number): jMoment.Moment {
    return this.clone(date).add(years, 'jYear');
  }

  addCalendarMonths(date: jMoment.Moment, months: number): jMoment.Moment {
    return this.clone(date).add(months as any, 'jmonth');
  }

  addCalendarDays(date: jMoment.Moment, days: number): jMoment.Moment {
    return this.clone(date).add(days, 'day');
  }

  getISODateString(date: jMoment.Moment): string {
    return this.clone(date).format('jYYYY-jMM-jDD');
  }

  isDateInstance(obj: any): boolean {
    return minmin.isMoment(obj);
  }

  isValid(date: jMoment.Moment): boolean {
    return this.clone(date).isValid();
  }

  range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
      valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
  }
}
