import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, HostListener, ComponentFactoryResolver } from '@angular/core';
import { EventService } from './event.service';
import { JspsychHtmlKeyboardResponse } from './plugins/jspsych-html-keyboard-response/jspsych-html-keyboard-response';

@Component({
  selector: 'lib-jspsych',
  templateUrl: './jspsych.component.html',
  styleUrls: ['./jspsych.component.scss'],
  providers: [ EventService ],
})
export class JspsychComponent implements OnInit, AfterViewInit {
  @ViewChild("vc", { read: ViewContainerRef }) vc: ViewContainerRef;
  private activePluginComponent;

  constructor(private eventService: EventService, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngAfterViewInit(): void {
    // this.eventService.reset();
    // this.eventService.createKeyboardEventListeners();
  }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    this.eventService.root_keydown_listener(ev);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    this.eventService.root_keyup_listener(ev);
  }

  setCurrentTrial(trial: any){
    this.loadPlugin();
    this.activePluginComponent.instance.trial = trial;
    this.activePluginComponent.instance.loadTrial();
  }

  loadPlugin() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(JspsychHtmlKeyboardResponse);
    this.activePluginComponent = this.vc.createComponent(factory);

  }

  // TODO: add interaction listeners
  // Commit data directly to data service
}
