/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
    AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input, OnDestroy,
    Optional,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {MdCalendarCell} from './calendar-body';
import {createMissingDateImplError} from './datepicker-errors';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";


const DAYS_PER_WEEK = 7;


/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
@Component({
    moduleId: module.id,
    selector: 'md-month-view',
    templateUrl: 'month-view.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdMonthView<D> implements AfterContentInit, OnDestroy {

    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    @Input()
    get activeDate(): D {
        return this._activeDate;
    }

    set activeDate(value: D) {
        let oldActiveDate = this._activeDate;
        this._activeDate = value || this._dateAdapter.today();
        if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
            this._init();
        }
    }

    private _activeDate: D;

    /** The currently selected date. */
    @Input()
    get selected(): D {
        return this._selected;
    }

    set selected(value: D) {
        this._selected = value;
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
    }

    @Input()
    get subedDate(): D {
        return this._subed;
    }

    set subedDate(value: D) {
        this._subed = value;
        this._subedDate = this._getDateInCurrentMonth(this.subedDate);
    }

    private _selected: D;
    private _subed: D;

    /** A function used to filter which dates are selectable. */
    @Input() dateFilter: (date: D) => boolean;

    /** Emits when a new date is selected. */
    @Output() selectedChange = new EventEmitter<D | null>();

    /** Emits when any date is selected. */
    @Output() userSelection = new EventEmitter<void>();

    /** The label for this month (e.g. "January 2017"). */
    _monthLabel: string;
    _yearNumber: number;

    /** Grid of calendar cells representing the dates of the month. */
    _weeks: MdCalendarCell[][];

    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;

    /**
     * The date of the month that the currently selected Date falls on.
     * Null if the currently selected Date is in another month.
     */
    _selectedDate: number | null;
    _subedDate: number | null;
    mustDestroy;
    mustDestroy2;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number | null;

    /** The names of the weekdays. */
    _weekdays: { long: string, narrow: string }[];
    lang;

    constructor(@Optional() public _dateAdapter: DateAdapter<D>,
                @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: any, ref: ChangeDetectorRef) {
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }


        this._activeDate = this._dateAdapter.today();

        let any = _dateFormats as any;

        this.mustDestroy = any.getChanges().subscribe(
            (v) => {
                this._init();
                ref.detectChanges()
            },
            (e) => {

            },
            () => {
            }
        );
        this.mustDestroy2 = any._lastChanges.subscribe((v) => {
            this.lang = v;
        });
    }

    ngOnDestroy() {
        this.mustDestroy.unsubscribe();
        this.mustDestroy2.unsubscribe();
    }

    ngAfterContentInit(): void {
        this._init();
    }

    /** Handles when a new date is selected. */
    _dateSelected(date: number) {
        const selectedYear = this._dateAdapter.getYear(this.activeDate);
        const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
        const selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);

        this.selectedChange.emit(selectedDate);

        this.userSelection.emit();
    }

    /** Initializes this month view. */
    private _init() {
        const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');

        // Rotate the labels for days of the week based on the configured first day of the week.
        let weekdays = longWeekdays.map((long, i) => {
            return {long, narrow: narrowWeekdays[i]};
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._yearNumber = this._dateAdapter.getYear(this.activeDate);
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        let firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate),
            this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
    }

    /** Creates MdCalendarCells for the dates in this month. */
    private _createWeekCells() {
        let daysInMonthFa;
        let dateNamesFa;
        let daysInMonth = this._dateAdapter.getNumDaysInMonth(this._activeDate);
        let dateNames = this._dateAdapter.getDateNames();
        if ((this._dateAdapter as any).JDateAdapter) {
            let JAdapter = (this._dateAdapter as any).JDateAdapter;
            daysInMonthFa = JAdapter.getNumDaysInMonth(this._activeDate);
            dateNamesFa = JAdapter.getDateNames();
        }
        this._weeks = [[]];
        for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            let ariaLabelFa;
            let dateFa;
            let dateEn;
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            let date = this._dateAdapter.createDate(
                this._dateAdapter.getYear(this.activeDate),
                this._dateAdapter.getMonth(this.activeDate), i + 1);
            let enabled = !this.dateFilter ||
                this.dateFilter(date);
            if ((this._dateAdapter as any).JDateAdapter) {
                let JAdapter = (this._dateAdapter as any).JDateAdapter;
                dateFa = JAdapter.getDate(date);
                dateEn = (this._dateAdapter.getDate as any)(date, true);
                // ariaLabelFa = JAdapter.format(dateFa, '');
            }
            let ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            if (this.lang == 'en') {
                this._weeks[this._weeks.length - 1]
                    .push(new MdCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, dateFa));
            } else {
                this._weeks[this._weeks.length - 1]
                    .push(new MdCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, dateEn));
            }

        }
    }

    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth(date: D): number | null {
        return this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    }

    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    private _hasSameMonthAndYear(d1: D, d2: D): boolean {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    }
}
