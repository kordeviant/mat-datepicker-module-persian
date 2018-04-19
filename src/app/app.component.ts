import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <div>
        <div>date picker فارسی انگولار متریال</div>
        <div style="font-size: 11px; line-height: 11px">Persian Jalali DatePicker for Angular Material</div>
      </div>
    </mat-toolbar>
    <md-datepicker type="wide" #picker (selectedChanged)="setDateReturn($event);"></md-datepicker>
    <mat-form-field>
      <input required matInput (mouseup)="dpickerFocus(picker)" [(ngModel)]="today" (focus)="dpickerFocus(picker)" readonly
             [matDatepicker]="picker" placeholder="تاریخ">

    </mat-form-field>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  today = new Date(new Date().getTime() + 80000000);
  constructor() {
  }

  setDateReturn(e) {
    console.log(e);
  }

  dpickerFocus(picker) {
    picker.open();
  }
}
