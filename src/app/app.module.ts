import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JspsychModule } from 'jspsych'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    JspsychModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
