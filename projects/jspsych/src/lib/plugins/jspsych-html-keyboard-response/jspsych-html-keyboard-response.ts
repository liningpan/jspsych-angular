import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, Input, ElementRef } from '@angular/core';
import { EventService } from '../../event.service';
import { AbstractPlugin } from '../../abstract-plugin';

@Component({
  selector: 'lib-jspsych-html-keyboard-response',
  templateUrl: './jspsych-html-keyboard-response.html',
  styleUrls: ['./jspsych-html-keyboard-response.scss'],
})
export class JspsychHtmlKeyboardResponse extends AbstractPlugin {

  @ViewChild("stimulus_container") stimulusContainer: ElementRef;
  @ViewChild("trial_prompt") trialPromp: ElementRef;

  private stimulusElement: HTMLElement;
  private promptElement: HTMLElement;

  hidden = false;
  responded = false;
  keyboardListener;

  private response = {
    rt: null,
    key: null
  };


  initializeRawElements(): void {
    super.initializeRawElements();
    this.stimulusElement = this.stimulusContainer.nativeElement as HTMLElement;
    this.promptElement = this.trialPromp.nativeElement as HTMLElement;
  }

  loadTrial() {
    if (!this.trial || !this.viewLoaded) {
      return;
    }
    if (this.trial.stimulus) {
      this.stimulusElement.innerHTML = this.trial.stimulus;
    }
    if (this.trial.prompt) {
      this.promptElement.innerHTML = this.trial.prompt;
    }
    // register keyboard at module root level
    // start the response listener


    let self = this;

    if (this.trial.choices != 'nokeys') {
      this.keyboardListener = this.eventService.getKeyboardResponse({
        callback_function: (info) => {
          self.after_response(info);
        },
        valid_responses: self.trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (this.trial.stimulus_duration !== null) {
      this.eventService.setTimeout(function () {
        self.hidden = true;
      }, this.trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (this.trial.trial_duration !== null) {
      this.eventService.setTimeout(function () {
        self.end_trial();
      }, this.trial.trial_duration);
    }
  }

  end_trial() {
    this.eventService.clearAllTimeouts();

    if (this.keyboardListener) {
      this.eventService.cancelKeyboardResponse(this.keyboardListener);
    }

    var trial_data = {
      "rt": this.response.rt,
      "stimulus": this.trial.stimulus,
      "key_press": this.response.key
    };

    // clear display is not needed
    // commit to data service
  }

  after_response(info) {
    this.responded = true;
    if (this.trial.response_ends_trial) {
      this.end_trial();
    }
  }

}
