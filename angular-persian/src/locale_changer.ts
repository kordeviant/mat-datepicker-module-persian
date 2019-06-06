/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
    ChangeDetectionStrategy,
    Component,
    Inject, OnDestroy,
    Optional,
    ViewEncapsulation
} from '@angular/core';
import {createMissingDateImplError} from './datepicker-errors';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';


/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
@Component({
    moduleId: module.id,
    selector: 'md-locale-changer',
    template: `
        <mat-button-toggle-group #group="matButtonToggleGroup" (change)="_changeLocale()" [value]="lang">
            <mat-button-toggle value="fa">
                شمسی
            </mat-button-toggle>
            <mat-button-toggle value="en">
                میلادی
            </mat-button-toggle>
        </mat-button-toggle-group>
    `,
    styleUrls: ['locale-changer.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdLocaleChanger<D> implements OnDestroy {
    any;
    lang;
    mustDestroy;

    constructor(@Optional() public _dateAdapter: DateAdapter<D>,
                @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: any) {
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this.any = _dateAdapter as any;
        this.mustDestroy = (_dateFormats as any)._lastChanges.subscribe((v) => {
            this.lang = v;
        });
    }

    ngOnDestroy() {
        this.mustDestroy.unsubscribe();
    }

    // change locale function()
    _changeLocale() {
        this.any.changeLocale();
    }


}
