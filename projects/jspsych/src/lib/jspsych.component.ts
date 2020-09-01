import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, HostListener } from '@angular/core';
import { EventService } from './event.service';

@Component({
  selector: 'lib-jspsych',
  templateUrl: './jspsych.component.html',
  styleUrls: ['./jspsych.component.scss']
})
export class JspsychComponent implements OnInit, AfterViewInit {
  @ViewChild("vc", {read: ViewContainerRef}) vc: ViewContainerRef;

  constructor(private eventService: EventService) {
  }

  ngAfterViewInit(): void {
    this.eventService.reset();
    // this.eventService.createKeyboardEventListeners();
  }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev:KeyboardEvent) {
    this.eventService.root_keydown_listener(ev);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(ev:KeyboardEvent) {
    this.eventService.root_keyup_listener(ev);
  }

}
