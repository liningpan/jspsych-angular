import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EventService } from './event.service';

@Component({
  template: '',
  providers: [EventService],
})
export abstract class AbstractPlugin implements AfterViewInit {

  public trial: any;

  protected viewLoaded: boolean = false;

  constructor(protected eventService: EventService) { }

  ngAfterViewInit(): void {
    this.initializeRawElements();
    this.viewLoaded = true;
    if (this.trial) {
      this.loadTrial();
    }
  }


  initializeRawElements(): void { }

  loadTrial(): void { }

  abstract end_trial();

  abstract after_response(info:any);


}


