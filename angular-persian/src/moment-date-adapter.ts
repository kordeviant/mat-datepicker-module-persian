import {Inject, Injectable, LOCALE_ID, Optional} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {JalaliMomentDateAdapter} from './jalali-date-adapter';
import {extendObject} from './object-extend';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


// TODO(mmalerba): Remove when we no longer support safari 9.
/** Whether the browser supports the Intl API. */
const SUPPORTS_INTL_API = typeof Intl != 'undefined';


/** The default month names to use if Intl API is not available. */
const DEFAULT_MONTH_NAMES = {
    'long': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ],
    'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};


/** The default date names to use if Intl API is not available. */
const DEFAULT_DATE_NAMES = range(31, i => String(i + 1));


/** The default day of the week names to use if Intl API is not available. */
const DEFAULT_DAY_OF_WEEK_NAMES = {
    'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}


/** Adapts the native JS Date for use with cdk-based components that work with dates. */
@Injectable()
export class NativeDateAdapter extends DateAdapter<Date> {
    constructor(@Optional() @Inject(LOCALE_ID) localeId: any) {
        super();
        super.setLocale(localeId);
    }

    lang = 'fa';
    langSubject = new Subject();
    JDateAdapter = new JalaliMomentDateAdapter('fa');

    invalid() {
        return new Date();
    }

    toIso8601(date) {
        return 'hi';
    }

    sameDate(a, b) {
        return false;
    }

    setLocale(v) {
        super.setLocale(v);
        if (this.lang != 'fa') {
            this.lang = 'fa';
            this.langSubject.next('fa');
        } else {
            this.lang = 'en';
            this.langSubject.next('en');
        }
    }

    getLang() {
        return this.langSubject;
    }

    changeLocale() {
        if (this.lang != 'fa') {
            this.setLocale('fa');
        } else {
            this.setLocale('en');
        }
    }

    /**
     * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
     * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
     * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
     * will produce `'8/13/1800'`.
     */
    useUtcForDisplay = true;

    getYear(date: any, force?): number {

        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getYear(date as any);
        }
        if (date._d) {
            return date._d.getFullYear();
        }
        if(!date.getFullYear) {
            debugger
        }
        return date.getFullYear();
    }

    getMonth(date: any, force?): number {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getMonth(date as any);
        }
        if (date._d) {
            return date._d.getMonth();
        }
        return date.getMonth();
    }

    getDate(date: any, force?): number {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getDate(date as any);
        }
        if (date._d) {
            return date._d.getDate();
        }
        return date.getDate();
    }

    getDayOfWeek(date: Date, force?): number {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getDayOfWeek(date as any);
        }
        return date.getDay();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow', force?): string[] {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getMonthNames(style);
        }
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {month: style});
            return range(12, i => this._stripDirectionalityCharacters(dtf.format(new Date(2017, i, 1))));
        }
        return DEFAULT_MONTH_NAMES[style];
    }

    getDateNames(force?): string[] {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getDateNames();
        }
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {day: 'numeric'});
            return range(31, i => this._stripDirectionalityCharacters(
                dtf.format(new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DATE_NAMES;
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow', force?): string[] {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getDayOfWeekNames(style);
        }
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {weekday: style});
            return range(7, i => this._stripDirectionalityCharacters(
                dtf.format(new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }

    getYearName(date: Date, force?): string {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getYearName(date as any);
        }
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {year: 'numeric'});
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return String(this.getYear(date));
    }

    getFirstDayOfWeek(force?): number {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getFirstDayOfWeek();
        }
        // We can't tell using native JS Date what the first day of the week is, we default to Sunday.
        return 0;
    }

    getNumDaysInMonth(date: Date, force?): number {
        if (this.lang == 'fa' && !force) {
            return this.JDateAdapter.getNumDaysInMonth(date as any, 'fa');
        }
        return this.getDate(this._createDateWithOverflow(
            this.getYear(date), this.getMonth(date) + 1, 0));
    }

    clone(date: Date): Date {
        if (this.lang == 'fa') {
            return (this.JDateAdapter.clone(date as any)) as any;
        }
        return this.createDate(this.getYear(date), this.getMonth(date), this.getDate(date));
    }

    createDate(year: number, month: number, date: number): Date {
        if (this.lang == 'fa') {
            return (this.JDateAdapter.createDate(year, month, date)) as any;
        }
        // Check for invalid month and date (except upper bound on date which we have to check after
        // creating the Date).
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }

        const result = this._createDateWithOverflow(year, month, date);

        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() != month) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }

        return result;
    }

    today(): Date {
        if (this.lang == 'fa') {
            return (this.JDateAdapter.today()) as any;
        }
        return new Date();
    }

    parse(value: any): Date | null {
        if (this.lang == 'fa') {
            return this.JDateAdapter.parse(value, []) as any;
        }
        // We have no way using the native JS Date to set the parse format or locale, so we ignore these
        // parameters.
        if (typeof value == 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }

    format(date: any, displayFormat: Object): string {
        if (this.lang == 'fa') {
            return this.JDateAdapter.format(date as any, displayFormat);
        }
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }
        if (SUPPORTS_INTL_API) {
            if (this.useUtcForDisplay) {
                if (date._d) {
                    date = new Date(Date.UTC(
                        date._d.getFullYear(), date._d.getMonth(), date._d.getDate(), date._d.getHours(),
                        date._d.getMinutes(), date._d.getSeconds(), date._d.getMilliseconds()));
                    displayFormat = extendObject({}, displayFormat, {timeZone: 'utc'});
                } else {
                    date = new Date(Date.UTC(
                        date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
                        date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
                    displayFormat = extendObject({}, displayFormat, {timeZone: 'utc'});
                }
            }
            const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return this._stripDirectionalityCharacters(dtf.format(date));
        }
        return this._stripDirectionalityCharacters(date.toDateString());
    }

    addCalendarYears(date: Date, years: number): Date {
        if (this.lang == 'fa') {
            return this.JDateAdapter.addCalendarYears(date as any, years) as any;
        }
        return this.addCalendarMonths(date, years * 12);
    }

    addCalendarMonths(date: Date, months: number): Date {
        if (this.lang == 'fa') {
            return this.JDateAdapter.addCalendarMonths(date as any, months) as any;
        }
        let newDate = this._createDateWithOverflow(
            this.getYear(date), this.getMonth(date) + months, this.getDate(date));

        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
        }

        return newDate;
    }

    addCalendarDays(date: Date, days: number): Date {
        if (this.lang == 'fa') {
            return this.JDateAdapter.addCalendarDays(date as any, days) as any;
        }
        return this._createDateWithOverflow(
            this.getYear(date), this.getMonth(date), this.getDate(date) + days);
    }

    getISODateString(date: Date): string {
        if (this.lang == 'fa') {
            return this.JDateAdapter.getISODateString(date as any);
        }
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate())
        ].join('-');
    }

    isDateInstance(obj: any) {
        return obj instanceof Date;
    }

    isValid(date: any) {
        if (date._d) {
            return !isNaN(date._d.getTime());
        }

        return !isNaN(date.getTime());
    }

    /** Creates a date but allows the month and date to overflow. */
    private _createDateWithOverflow(year: number, month: number, date: number) {
        const result = new Date(year, month, date);

        // We need to correct for the fact that JS native Date treats years in range [0, 99] as
        // abbreviations for 19xx.
        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    }

    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    private _2digit(n: number) {
        return ('00' + n).slice(-2);
    }

    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private _stripDirectionalityCharacters(str: string) {
        return str.replace(/[\u200e\u200f]/g, '');
    }
}

export class dateFormat {
    parse: any = {
        dateInput: 'l',
    };
    display: any = {
        dateInput: 'jYYYY/jMM/jDD',
        monthYearLabel: 'jYYYY jMMMM',
        dateA11yLabel: 'jYYYY/jMM/jDD',
        monthYearA11yLabel: 'jYYYY jMMMM'
    };

    _getChanges = new Subject();
    public _lastChanges = new BehaviorSubject('fa');

    constructor(_dateAdapter: DateAdapter<any>) {
        const dateAdapter = _dateAdapter as any;
        dateAdapter.getLang().subscribe(
            v => {
                if (v == 'fa') {
                    this.parse = {
                        dateInput: 'l',
                    };
                    this.display = {
                        dateInput: 'jYYYY/jMM/jDD',
                        monthYearLabel: 'jYYYY jMMMM',
                        dateA11yLabel: 'jYYYY/jMM/jDD',
                        monthYearA11yLabel: 'jYYYY jMMMM'
                    };
                } else {
                    this.parse = {
                        dateInput: null,
                    };
                    this.display = {
                        dateInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
                        monthYearLabel: {year: 'numeric', month: 'short'},
                        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
                        monthYearA11yLabel: {year: 'numeric', month: 'long'},
                    };
                }
                this._lastChanges.next(v);
                this._getChanges.next(v);
            },
            (e) => {
            },
            () => {
            });
    }

    getChanges() {
        return this._getChanges;
    }

}
