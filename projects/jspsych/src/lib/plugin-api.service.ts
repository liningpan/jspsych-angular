import { Injectable, ElementRef } from '@angular/core';
import { JspsychModule } from './jspsych.module';
import * as keycode from './core/keycode';
import { ResponseType } from './response-type';

@Injectable({
  providedIn: 'root'
})
export class PluginAPIService {
  private keyboard_listeners: any[] = [];

  private held_keys = {};


  // private root_element: ElementRef

  root_keydown_listener(e: KeyboardEvent) {
    for (var i = 0; i < this.keyboard_listeners.length; i++) {
      this.keyboard_listeners[i].fn(e);
    }
    this.held_keys[e.keyCode] = true;
  }

  root_keyup_listener(e: KeyboardEvent) {
    this.held_keys[e.keyCode] = false;
  }

  // reset(root_element){
  //   this.keyboard_listeners = [];
  //   this.held_keys = {};
  //   root_element.removeEventListener('keydown', this.root_keydown_listener);
  //   root_element.removeEventListener('keyup', this.root_keyup_listener);
  // }

  // createKeyboardEventListeners(root_element) {
  //   root_element.addEventListener('keydown', this.root_keydown_listener);
  //   root_element.addEventListener('keyup', this.root_keyup_listener);
  // }

  getKeyboardResponse(parameters) {
    //parameters are: callback_function, valid_responses, rt_method, persist, audio_context, audio_context_start_time, allow_held_key?

    parameters.rt_method = (typeof parameters.rt_method === 'undefined') ? 'performance' : parameters.rt_method;
    if (parameters.rt_method != 'performance' && parameters.rt_method != 'audio') {
      console.log('Invalid RT method specified in getKeyboardResponse. Defaulting to "performance" method.');
      parameters.rt_method = 'performance';
    }

    var start_time;
    if (parameters.rt_method == 'performance') {
      start_time = performance.now();
    } else if (parameters.rt_method == 'audio') {
      start_time = parameters.audio_context_start_time;
    }

    var listener_id;

    var listener_function = function (e) {
      var key_time;
      if (parameters.rt_method == 'performance') {
        key_time = performance.now();
      } else if (parameters.rt_method == 'audio') {
        key_time = parameters.audio_context.currentTime
      }

      var valid_response = false;
      if (typeof parameters.valid_responses === 'undefined' || parameters.valid_responses == ResponseType.ALL_KEYS) {
        valid_response = true;
      } else {
        if (parameters.valid_responses != ResponseType.NO_KEYS) {
          for (var i = 0; i < parameters.valid_responses.length; i++) {
            if (typeof parameters.valid_responses[i] == 'string') {
              var kc = keycode.convertKeyCharacterToKeyCode(parameters.valid_responses[i]);
              if (typeof kc !== 'undefined') {
                if (e.keyCode == kc) {
                  valid_response = true;
                }
              } else {
                throw new Error('Invalid key string specified for getKeyboardResponse');
              }
            } else if (e.keyCode == parameters.valid_responses[i]) {
              valid_response = true;
            }
          }
        }
      }
      // check if key was already held down

      if (((typeof parameters.allow_held_key == 'undefined') || !parameters.allow_held_key) && valid_response) {
        if (typeof this.held_keys[e.keyCode] !== 'undefined' && this.held_keys[e.keyCode] == true) {
          valid_response = false;
        }
      }

      if (valid_response) {
        // if this is a valid response, then we don't want the key event to trigger other actions
        // like scrolling via the spacebar.
        e.preventDefault();

        parameters.callback_function({
          key: e.keyCode,
          rt: key_time - start_time
        });

        if (this.keyboard_listeners.includes(listener_id)) {
          if (!parameters.persist) {
            // remove keyboard listener
            // cancelKeyboardResponse(listener_id);
          }
        }
      }
    };

    // create listener id object
    listener_id = {
      type: 'keydown',
      fn: listener_function
    };

    // add this keyboard listener to the list of listeners
    this.keyboard_listeners.push(listener_id);

    return listener_id;

  };

  cancelKeyboardResponse(listener) {
    // remove the listener from the list of listeners
    if (this.keyboard_listeners.includes(listener)) {
      this.keyboard_listeners.splice(this.keyboard_listeners.indexOf(listener), 1);
    }
  };

  cancelAllKeyboardResponses(){
    this.keyboard_listeners = [];
  };

  private timeout_handlers = [];

  setTimeout(callback, delay){
    var handle = setTimeout(callback, delay);
    this.timeout_handlers.push(handle);
    return handle;
  }

  clearAllTimeouts = function(){
    for(var i=0;i<this.timeout_handlers.length; i++){
      clearTimeout(this.timeout_handlers[i]);
    }
    this.timeout_handlers = [];
  }

  private video_buffers = {}
  getVideoBuffer = function(videoID) {
    return this.video_buffers[videoID]
  }


  private context = null;
  private audio_buffers = [];

  initAudio(){
    // this.context = (jsPsych.initSettings().use_webaudio === true) ? jsPsych.webaudio_context : null;
  }

  audioContext = function(){
    if(this.context !== null){
      if(this.context.state !== 'running'){
        this.context.resume();
      }
    }
    return this.context;
  }

  getAudioBuffer = function(audioID) {
    if (this.audio_buffers[audioID] === 'tmp') {
      console.error('Audio file failed to load in the time allotted.')
      return;
    }
    return this.audio_buffers[audioID];
  }


  constructor() { }
}

