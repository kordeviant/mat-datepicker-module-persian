import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <div>
        <div>date picker فارسی انگولار متریال</div>
        <div style="font-size: 11px; line-height: 11px">Persian Jalali DatePicker for Angular Material</div>
      </div>
    </mat-toolbar>
    <div style="padding: 50px 50px 0">
      <a href="https://badge.fury.io/js/%40angular-persian%2Fmaterial-date-picker"><img src="https://badge.fury.io/js/%40angular-persian%2Fmaterial-date-picker.svg" alt="npm version" height="22"></a>

      <h3>امکانات</h3>
      <ul>
        <li>تمامی امکانات datepicker متریال</li>
        <li>امکان تغییر حالت شمسی/میلادی</li>
        <li>حالت تکی و دوتایی (بزرگ و کوچک)</li>
        <li>امکان انتخاب ماه و سال</li>
        <li>امکان نمایش تاریخ اول در دومی</li>
      </ul>
    </div>
    <md-datepicker [type]="type ? 'wide' : 'normal'" #picker></md-datepicker>
    <md-datepicker [type]="type ? 'wide' : 'normal'" #picker2 [subed]="firstDate"></md-datepicker>
    <mat-form-field class="centered">
      <input required matInput (mouseup)="dpickerFocus(picker)" [(ngModel)]="firstDate" (focus)="dpickerFocus(picker)" readonly
             [matDatepicker]="picker" placeholder="تاریخ اول">

    </mat-form-field>
    <mat-form-field class="centered">
      <input required matInput (mouseup)="dpickerFocus(picker2)" [(ngModel)]="secondDate" (focus)="dpickerFocus(picker2)" readonly
             [matDatepicker]="picker2" placeholder="تاریخ دوم">

    </mat-form-field>
    <div class="centered">
      <mat-checkbox matInput [(ngModel)]="type">wide</mat-checkbox>
    </div>
    <span class="love">
    Made with <i class="fa fa-heart pulse"></i> in Iran
    </span>
    <span class="love" style="margin: 0 0 50px;">
      <div>
        <a class="github-button" href="https://github.com/kordeviant/mat-datepciker-module-persian"
           data-size="large" data-show-count="true" aria-label="Star kordeviant/mat-datepciker-module-persian on GitHub">Star</a>
      </div>
    </span>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  firstDate = new Date(new Date().getTime() + 80000000);
  secondDate = new Date(new Date().getTime() + 240000000);
  @ViewChild('picker') picker;
  type = true;

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.dpickerFocus(this.picker);
    },500);
  }

  setDateReturn(e) {
    console.log(e);
  }

  dpickerFocus(picker) {
    picker.open();
  }
}
