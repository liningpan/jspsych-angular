import { NgModule } from '@angular/core';
import { JspsychComponent } from './jspsych.component';
import { EventService } from './event.service';
import { DataService } from './data.service';
import { TimelineService } from './timeline.service';



@NgModule({
  declarations: [JspsychComponent],
  imports: [
  ],
  exports: [JspsychComponent],
  providers: [
    EventService,
    DataService,
    TimelineService
  ]
})
export class JspsychModule { }
