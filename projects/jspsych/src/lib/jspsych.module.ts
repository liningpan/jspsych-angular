import { NgModule } from '@angular/core';
import { JspsychComponent } from './jspsych.component';
import { PluginAPIService } from './plugin-api.service';
import { DataService } from './data.service';
import { TimelineService } from './timeline.service';



@NgModule({
  declarations: [JspsychComponent],
  imports: [
  ],
  exports: [JspsychComponent],
  providers: [ PluginAPIService, DataService, TimelineService ]
})
export class JspsychModule { }
