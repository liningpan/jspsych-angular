import { Injectable } from '@angular/core';
import { TimelineService } from './timeline.service';
import { EventService } from './event.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class JspsychService {

  // reset variables
  private opts: any;
  // replace with timeline service
  //timeline = null;
  global_trial_index = 0;

  // current_trial state delegate through timeline service
  current_trial: any = {};
  current_trial_finished = false;

  paused = false;
  waiting = false;
  loaded = false;
  loadfail = false;
  private exp_start_time: Date;

  constructor(
    private timelineService: TimelineService,
    private eventService: EventService,
    private dataService: DataService
  ) { }

  init(opts: any) {
    this.opts = opts;
    // default options processed through type
    this.global_trial_index = 0;

    // // current_trial state delegate through timeline service
    this.current_trial = {};
    this.current_trial_finished = false;

    this.paused = false;
    this.waiting = false;
    this.loaded = false;
    this.loadfail = false;

    // display element is an Angular component
    // call audio init
    this.eventService.reset();
    // keyboard events are automatically connected to event service
    window.addEventListener('beforeunload', opts.on_close);

    this.checkExclusions(opts.exclusions,
      () => {
        this.startExperiment();

        // success! user can continue...
        // start experiment, with or without preloading
        // if(opts.auto_preload){
        //   this.autoPreload(timeline, startExperiment, opts.preload_images, opts.preload_audio, opts.preload_video, opts.show_preload_progress_bar);
        //   if(opts.max_load_time > 0){
        //     setTimeout(function(){
        //       if(!this.loaded && !this.loadfail){
        //         //loadFail();
        //       }
        //     }, opts.max_load_time);
        //   }
        // } else {
        //
        // }
      },
      function () {
        // fail. incompatible user.

      }
    );
  }

  startTime() {
    return this.exp_start_time;
  }

  totalTime() {
    if (!this.exp_start_time) { return 0; }
    return (new Date()).getTime() - this.exp_start_time.getTime();
  };

  // These elements (native DOM elements) can be provided once main component is initialized
  // getDisplayElement() {
  //   return DOM_target;
  // };

  // getDisplayContainerElement(){
  //   return DOM_container;
  // }

  finishTrial(data?) {

    if (this.current_trial_finished) { return; }
    this.current_trial_finished = true;

    // write the data from the trial
    data = typeof data == 'undefined' ? {} : data;
    this.dataService.write(data);

    // get back the data with all of the defaults in
    var trial_data = this.dataService.get().filter({ trial_index: this.global_trial_index });

    // for trial-level callbacks, we just want to pass in a reference to the values
    // of the DataCollection, for easy access and editing.
    var trial_data_values = trial_data.values()[0];

    // handle callback at plugin level
    if (typeof this.current_trial.on_finish === 'function') {
      this.current_trial.on_finish(trial_data_values);
    }

    // handle callback at whole-experiment level
    this.opts.on_trial_finish(trial_data_values);

    // after the above callbacks are complete, then the data should be finalized
    // for this trial. call the on_data_update handler, passing in the same
    // data object that just went through the trial's finish handlers.
    this.opts.on_data_update(trial_data_values);

    // wait for iti
    if (typeof this.current_trial.post_trial_gap === null || typeof this.current_trial.post_trial_gap === 'undefined') {
      if (this.opts.default_iti > 0) {
        setTimeout(this.nextTrial, this.opts.default_iti);
      } else {
        this.nextTrial();
      }
    } else {
      if (this.current_trial.post_trial_gap > 0) {
        setTimeout(this.nextTrial, this.current_trial.post_trial_gap);
      } else {
        this.nextTrial();
      }
    }
  }

  endExperiment(end_message) {
    //this.timelineService.end_message = end_message;
    this.timelineService.end();
    this.eventService.cancelAllKeyboardResponses();
    this.eventService.clearAllTimeouts();
    this.finishTrial();
  }

  endCurrentTimeline() {
    this.timelineService.endActiveNode();
  }

  currentTrial() {
    return this.current_trial;
  };

  initSettings() {
    return this.opts;
  };

  currentTimelineNodeID() {
    return this.timelineService.activeID();
  };

  timelineVariable(varname, execute) {
    if (execute) {
      return this.timelineService.timelineVariable(varname);
    } else {
      return () => { return this.timelineService.timelineVariable(varname); }
    }
  }

  addNodeToEndOfTimeline(new_timeline, preload_callback?: () => any) {
    this.timelineService.insert(new_timeline);
    if (preload_callback) {
      if (this.opts.auto_preload) {
        //jsPsych.pluginAPI.autoPreload(timeline, preload_callback);
      } else {
        preload_callback();
      }
    }
  }

  pauseExperiment() {
    this.paused = true;
  }

  resumeExperiment() {
    this.paused = false;
    if (this.waiting) {
      this.waiting = false;
      this.nextTrial();
    }
  }

  loadFail(message) {
    //message = message || '<p>The experiment failed to load.</p>';
    this.loadfail = true;
    //DOM_target.innerHTML = message;
  }


  startExperiment() {

    this.loaded = true;

    // TODO progress bar implementation
    // show progress bar if requested
    // if (opts.show_progress_bar === true) {
    //   drawProgressBar(opts.message_progress_bar);
    // }

    // record the start time
    this.exp_start_time = new Date();

    // begin!
    this.timelineService.advance();
    this.doTrial(this.timelineService.trial());

  }

  finishExperiment() {

    // if (typeof this.timelineService.end_message !== 'undefined') {
    //   DOM_target.innerHTML = timeline.end_message;
    // }

    this.opts.on_finish(this.dataService.get());

  }

  nextTrial() {
    // if experiment is paused, don't do anything.
    if (this.paused) {
      this.waiting = true;
      return;
    }

    this.global_trial_index++;

    // advance timeline
    this.timelineService.markCurrentTrialComplete();
    var complete = this.timelineService.advance();

    // update progress bar if shown
    if (this.opts.show_progress_bar === true && this.opts.auto_update_progress_bar == true) {
      // updateProgressBar();
    }

    // check if experiment is over
    if (complete) {
      this.finishExperiment();
      return;
    }

    this.doTrial(this.timelineService.trial());
  }

  doTrial(trial) {

    this.current_trial = trial;
    this.current_trial_finished = false;

    // process all timeline variables for this trial
    this.evaluateTimelineVariables(trial);

    // evaluate variables that are functions
    this.evaluateFunctionParameters(trial);

    // get default values for parameters
    this.setDefaultValues(trial);

    // call experiment wide callback
    this.opts.on_trial_start(trial);

    // call trial specific callback if it exists
    if (typeof trial.on_start == 'function') {
      trial.on_start(trial);
    }

    // Main container viewport
    // apply the focus to the element containing the experiment.
    //DOM_container.focus();

    // reset the scroll on the DOM target
    //DOM_target.scrollTop = 0;

    // plugin service
    // execute trial method
    // jsPsych.plugins[trial.type].trial(DOM_target, trial);

    // call trial specific loaded callback if it exists
    if (typeof trial.on_load == 'function') {
      trial.on_load();
    }
  }

  evaluateTimelineVariables(trial) {
    var keys = Object.keys(trial);

    for (var i = 0; i < keys.length; i++) {
      // timeline variables on the root level
      // TODO: factor out function string
      if (typeof trial[keys[i]] == "function" && trial[keys[i]].toString().replace(/\s/g, '') == "function(){returntimeline.timelineVariable(varname);}") {
        trial[keys[i]] = trial[keys[i]].call();
      }
      // timeline variables that are nested in objects
      if (typeof trial[keys[i]] == "object" && trial[keys[i]] !== null) {
        this.evaluateTimelineVariables(trial[keys[i]]);
      }
    }
  }

  evaluateFunctionParameters(trial) {

    // first, eval the trial type if it is a function
    // this lets users set the plugin type with a function
    if (typeof trial.type === 'function') {
      trial.type = trial.type.call();
    }

    // now eval the whole trial

    // start by getting a list of the parameters
    var keys = Object.keys(trial);

    // iterate over each parameter
    for (var i = 0; i < keys.length; i++) {
      // check to make sure parameter is not "type", since that was eval'd above.
      if (keys[i] !== 'type') {
        // this if statement is checking to see if the parameter type is expected to be a function, in which case we should NOT evaluate it.
        // the first line checks if the parameter is defined in the universalPluginParameters set
        // the second line checks the plugin-specific parameters
        // TODO: plugin parameter support
        // if (
        //   (typeof jsPsych.plugins.universalPluginParameters[keys[i]] !== 'undefined' && jsPsych.plugins.universalPluginParameters[keys[i]].type !== jsPsych.plugins.parameterType.FUNCTION) ||
        //   (typeof jsPsych.plugins[trial.type].info.parameters[keys[i]] !== 'undefined' && jsPsych.plugins[trial.type].info.parameters[keys[i]].type !== jsPsych.plugins.parameterType.FUNCTION)
        // ) {
        //   if (typeof trial[keys[i]] == "function") {
        //     trial[keys[i]] = trial[keys[i]].call();
        //   }
        // }
      }
      // add a special exception for the data parameter so we can evaluate functions. eventually this could be generalized so that any COMPLEX object type could
      // be evaluated at the individual parameter level.
      if (keys[i] == 'data') {
        var data_params = Object.keys(trial[keys[i]]);
        for (var j = 0; j < data_params.length; j++) {
          if (typeof trial[keys[i]][data_params[j]] == "function") {
            trial[keys[i]][data_params[j]] = trial[keys[i]][data_params[j]].call();
          }
        }
      }
    }
  }

  setDefaultValues(trial) {
    // for (var param in jsPsych.plugins[trial.type].info.parameters) {
    //   // check if parameter is complex with nested defaults
    //   if (jsPsych.plugins[trial.type].info.parameters[param].type == jsPsych.plugins.parameterType.COMPLEX) {
    //     if (jsPsych.plugins[trial.type].info.parameters[param].array == true) {
    //       // iterate over each entry in the array
    //       for (var i in trial[param]) {
    //         // check each parameter in the plugin description
    //         for (var p in jsPsych.plugins[trial.type].info.parameters[param].nested) {
    //           if (typeof trial[param][i][p] == 'undefined' || trial[param][i][p] === null) {
    //             if (typeof jsPsych.plugins[trial.type].info.parameters[param].nested[p].default == 'undefined') {
    //               console.error('You must specify a value for the ' + p + ' parameter (nested in the ' + param + ' parameter) in the ' + trial.type + ' plugin.');
    //             } else {
    //               trial[param][i][p] = jsPsych.plugins[trial.type].info.parameters[param].nested[p].default;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   // if it's not nested, checking is much easier and do that here:
    //   else if (typeof trial[param] == 'undefined' || trial[param] === null) {
    //     if (typeof jsPsych.plugins[trial.type].info.parameters[param].default == 'undefined') {
    //       console.error('You must specify a value for the ' + param + ' parameter in the ' + trial.type + ' plugin.');
    //     } else {
    //       trial[param] = jsPsych.plugins[trial.type].info.parameters[param].default;
    //     }
    //   }
    // }
  }

  checkExclusions(exclusions, success: () => void, fail: () => void) {
    var clear = true;

    // MINIMUM SIZE
    if (typeof exclusions.min_width !== 'undefined' || typeof exclusions.min_height !== 'undefined') {
      var mw = typeof exclusions.min_width !== 'undefined' ? exclusions.min_width : 0;
      var mh = typeof exclusions.min_height !== 'undefined' ? exclusions.min_height : 0;
      var w = window.innerWidth;
      var h = window.innerHeight;
      if (w < mw || h < mh) {
        clear = false;
        var interval = setInterval(() => {
          var w = window.innerWidth;
          var h = window.innerHeight;
          // implement a warning template
          // if(w < mw || h < mh){
          //   var msg = '<p>Your browser window is too small to complete this experiment. '+
          //     'Please maximize the size of your browser window. If your browser window is already maximized, '+
          //     'you will not be able to complete this experiment.</p>'+
          //     '<p>The minimum width is '+mw+'px. Your current width is '+w+'px.</p>'+
          //     '<p>The minimum height is '+mh+'px. Your current height is '+h+'px.</p>';
          //   getDisplayElement().innerHTML = msg;
          // } else {
          //   clearInterval(interval);
          //   getDisplayElement().innerHTML = '';
          //   checkExclusions(exclusions, success, fail);
          // }
        }, 100);
        return; // prevents checking other exclusions while this is being fixed
      }
    }

    // WEB AUDIO API
    // if(typeof exclusions.audio !== 'undefined' && exclusions.audio) {
    //   if(window.hasOwnProperty('AudioContext') || window.hasOwnProperty('webkitAudioContext')){
    //     // clear
    //   } else {
    //     clear = false;
    //     var msg = '<p>Your browser does not support the WebAudio API, which means that you will not '+
    //       'be able to complete the experiment.</p><p>Browsers that support the WebAudio API include '+
    //       'Chrome, Firefox, Safari, and Edge.</p>';
    //     getDisplayElement().innerHTML = msg;
    //     fail();
    //     return;
    //   }
    // }

    // GO?
    if (clear) { success(); }
  }
}
