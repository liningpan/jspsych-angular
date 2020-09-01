import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'lib-jspsych-html-keyboard-response',
  templateUrl: './jspsych-html-keyboard-response.html',
  styleUrls: ['./jspsych-html-keyboard-response.scss']
})
export class JspsychHtmlKeyboardResponse implements OnInit, AfterViewInit {
  @ViewChild("stimulus_container") stimulusContainer: ElementRef;
  @ViewChild("trial_prompt") trialPromp: ElementRef;
  private stimulusElement: HTMLElement;
  private promptElement: HTMLElement;
  private hidden = false;
  private responded = false;

  @Input()
  trial: any


  constructor() { }

  ngAfterViewInit(): void {
    this.stimulusElement = this.stimulusContainer.nativeElement as HTMLElement
    if(this.trial.stimulus){
      this.stimulusElement.innerHTML = this.trial.stimulus;
    }

    this.promptElement = this.trialPromp.nativeElement as HTMLElement

    if(this.trial.prompt){
      this.promptElement.innerHTML = this.trial.prompt;
    }
    //register keyboard at module root level
  }

  ngOnInit(): void {
  }

  end_trial(){

  }

  after_response(){

  }

}
