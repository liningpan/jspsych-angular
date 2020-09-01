import { DataCollection } from './data/data-collection';

import { Injectable } from '@angular/core';
import { TimelineService } from './timeline.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private timelineService: TimelineService){}

  // data storage object
  private allData = new DataCollection();

  // browser interaction event data
  private interactionData = new DataCollection();

  // data properties for all trials
  private dataProperties = {};

  // cache the query_string
  private query_string;

  reset() {
    this.allData = new DataCollection();
    this.interactionData = new DataCollection();
  }

  get() {
    return this.allData;
  }

  getInteractionData() {
    return this.interactionData;
  }

  write(data_object) {

    var progress = this.timelineService.progress();
    var trial = this.timelineService.currentTrial();

    //var trial_opt_data = typeof trial.data == 'function' ? trial.data() : trial.data;

    var default_data = {
      'trial_type': trial.type,
      'trial_index': progress.current_trial_global,
      'time_elapsed': this.timelineService.totalTime(),
      'internal_node_id': this.timelineService.currentTimelineNodeID()
    };

    var ext_data_object = Object.assign({}, data_object, trial.data, default_data, this.dataProperties);

    this.allData.push(ext_data_object);
  }

  addProperties(properties) {

    // first, add the properties to all data that's already stored
    this.allData.addToAll(properties);

    // now add to list so that it gets appended to all future data
    this.dataProperties = Object.assign({}, this.dataProperties, properties);

  }

  addDataToLastTrial(data) {
    this.allData.addToLast(data);
  }

  getDataByTimelineNode(node_id) {
    var data = this.allData.filterCustom(function (x) {
      return x.internal_node_id.slice(0, node_id.length) === node_id;
    });

    return data;
  }

  getLastTrialData() {
    return this.allData.top();
  };

  getLastTimelineData() {
    var lasttrial = this.getLastTrialData();
    var node_id = lasttrial.select('internal_node_id').values[0];
    if (typeof node_id === 'undefined') {
      return new DataCollection();
    } else {
      var parent_node_id = node_id.substr(0, node_id.lastIndexOf('-'));
      var lastnodedata = this.getDataByTimelineNode(parent_node_id);
      return lastnodedata;
    }
  }

  // displayData(format) {
  //   format = (typeof format === 'undefined') ? "json" : format.toLowerCase();
  //   if (format != "json" && format != "csv") {
  //     console.log('Invalid format declared for displayData function. Using json as default.');
  //     format = "json";
  //   }

  //   var data_string;

  //   if (format == 'json') {
  //     data_string = allData.json(true); // true = pretty print with tabs
  //   } else {
  //     data_string = allData.csv();
  //   }

  //   var display_element = jsPsych.getDisplayElement();

  //   display_element.innerHTML = '<pre id="jspsych-data-display"></pre>';

  //   document.getElementById('jspsych-data-display').textContent = data_string;
  // };

  // this.urlVariables() {
  //   if (typeof query_string == 'undefined') {
  //     query_string = getQueryString();
  //   }
  //   return query_string;
  // }

  // this.getURLVariable(whichvar) {
  //   if (typeof query_string == 'undefined') {
  //     query_string = getQueryString();
  //   }
  //   return query_string[whichvar];
  // }

  // this.createInteractionListeners() {
  //   // blur event capture
  //   window.addEventListener('blur', function () {
  //     var data = {
  //       event: 'blur',
  //       trial: jsPsych.progress().current_trial_global,
  //       time: jsPsych.totalTime()
  //     };
  //     interactionData.push(data);
  //     jsPsych.initSettings().on_interaction_data_update(data);
  //   });

  //   // focus event capture
  //   window.addEventListener('focus', function () {
  //     var data = {
  //       event: 'focus',
  //       trial: jsPsych.progress().current_trial_global,
  //       time: jsPsych.totalTime()
  //     };
  //     interactionData.push(data);
  //     jsPsych.initSettings().on_interaction_data_update(data);
  //   });

  //   // fullscreen change capture
  //   function fullscreenchange() {
  //     var type = (document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen || document.fullscreenElement) ? 'fullscreenenter' : 'fullscreenexit';
  //     var data = {
  //       event: type,
  //       trial: jsPsych.progress().current_trial_global,
  //       time: jsPsych.totalTime()
  //     };
  //     interactionData.push(data);
  //     jsPsych.initSettings().on_interaction_data_update(data);
  //   }

  //   document.addEventListener('fullscreenchange', fullscreenchange);
  //   document.addEventListener('mozfullscreenchange', fullscreenchange);
  //   document.addEventListener('webkitfullscreenchange', fullscreenchange);
  // }

  // public methods for testing purposes. not recommended for use.
  _customInsert(data) {
    this.allData = new DataCollection(data);
  }

  _fullreset() {
    this.reset();
    this.dataProperties = {};
  }

  // private function to save text file on local drive
  // function saveTextToFile(textstr, filename) {
  //   var blobToSave = new Blob([textstr], {
  //     type: 'text/plain'
  //   });
  //   var blobURL = "";
  //   if (typeof window.webkitURL !== 'undefined') {
  //     blobURL = window.webkitURL.createObjectURL(blobToSave);
  //   } else {
  //     blobURL = window.URL.createObjectURL(blobToSave);
  //   }

  //   var display_element = jsPsych.getDisplayElement();

  //   display_element.insertAdjacentHTML('beforeend', '<a id="jspsych-download-as-text-link" style="display:none;" download="' + filename + '" href="' + blobURL + '">click to download</a>');
  //   document.getElementById('jspsych-download-as-text-link').click();
  // }

  //
  // A few helper functions to handle data format conversion
  //

  // this function based on code suggested by StackOverflow users:
  // http://stackoverflow.com/users/64741/zachary
  // http://stackoverflow.com/users/317/joseph-sturtevant

}
