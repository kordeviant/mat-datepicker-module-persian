/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ModuleWithProviders, NgModule} from '@angular/core';
import {MdMonthView} from './month-view';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {A11yModule} from '@angular/cdk/a11y';
import {MdCalendarBody} from './calendar-body';
import {MdYearView} from './year-view';
import {
    MdDatepicker,
    MdDatepickerContent,
    MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER,
} from './datepicker';
import {MdDatepickerInput} from './datepicker-input';
import {MdCalendar} from './calendar';
import {MdDatepickerToggle} from './datepicker-toggle';
import {MdDatepickerIntl} from './datepicker-intl';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MdLocaleChanger} from './locale_changer';
import {dateFormat, NativeDateAdapter} from './moment-date-adapter';


export * from './calendar';
export * from './calendar-body';
export * from './datepicker';
export * from './datepicker-input';
export * from './datepicker-intl';
export * from './datepicker-toggle';
export * from './month-view';
export * from './year-view';


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        OverlayModule,
        MatOptionModule,
        MatSelectModule,
        // StyleModule,
        A11yModule,
    ],
    exports: [
        MdCalendar,
        MdCalendarBody,
        MdDatepicker,
        MatButtonToggleModule,
        MdDatepickerInput,
        MdDatepickerToggle,
        MdMonthView,
        MdYearView,
    ],
    declarations: [
        MdCalendar,
        MdCalendarBody,
        MdLocaleChanger,
        MdDatepicker,
        MdDatepickerContent,
        MdDatepickerInput,
        MdDatepickerToggle,
        MdMonthView,
        MdYearView,
    ],
    providers: [
        MdDatepickerIntl,
        MD_DATEPICKER_SCROLL_STRATEGY_PROVIDER,
        {provide: DateAdapter, useClass: NativeDateAdapter}, {
        provide: MAT_DATE_FORMATS,
        useClass: dateFormat,
        deps: [DateAdapter]}
    ],
    entryComponents: [
        MdDatepickerContent,
    ]
})
export class MatDatepickerModulePersian {
}
