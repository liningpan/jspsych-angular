import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { PluginAPIService } from './plugin-api.service';

@Component({
  selector: 'lib-jspsych',
  templateUrl: './jspsych.component.html',
  styleUrls: ['./jspsych.component.scss']
})
export class JspsychComponent implements OnInit, AfterViewInit {
  @ViewChild("vc", {read: ViewContainerRef}) vc: ViewContainerRef;

  constructor(private pluginApiService: PluginAPIService) {
    this.pluginApiService
  }
  ngAfterViewInit(): void {
    // Initialize jsPsych Container
    // Run ininitialization process
    // Run preload
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
  }

}
