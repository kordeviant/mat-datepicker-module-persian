import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatDatepickerModulePersian} from '@angular-persian/material-date-picker';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDatepickerModulePersian
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
