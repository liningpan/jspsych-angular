import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JspsychComponent } from './jspsych.component';
import { EventService } from './event.service';
import { DataService } from './data.service';
import { TimelineService } from './timeline.service';
import { JspsychHtmlKeyboardResponse } from './plugins/jspsych-html-keyboard-response/jspsych-html-keyboard-response';



@NgModule({
  declarations: [JspsychComponent, JspsychHtmlKeyboardResponse],
  imports: [
    CommonModule
  ],
  exports: [JspsychComponent],
  providers: [
    EventService,
    DataService,
    TimelineService
  ]
})
export class JspsychModule { }
