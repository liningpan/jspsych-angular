import { Injectable } from '@angular/core';
import { PluginList } from './plugin-list'
import { plugins } from './types'
@Injectable({
  providedIn: 'root'
})
export class PluginRegistryService {
  universalPluginParameters: Record<string, plugins.TrialParameter> = {
    "data": {
      type: plugins.parameterType.OBJECT,
      pretty_name: 'Data',
      default: {},
      description: 'Data to add to this trial (key-value pairs)'
    },
    "on_start": {
      type: plugins.parameterType.FUNCTION,
      pretty_name: 'On start',
      default: function () { return; },
      description: 'Function to execute when trial begins'
    },
    "on_finish": {
      type: plugins.parameterType.FUNCTION,
      pretty_name: 'On finish',
      default: function () { return; },
      description: 'Function to execute when trial is finished'
    },
    "on_load": {
      type: plugins.parameterType.FUNCTION,
      pretty_name: 'On load',
      default: function () { return; },
      description: 'Function to execute after the trial has loaded'
    },
    "post_trial_gap": {
      type: plugins.parameterType.INT,
      pretty_name: 'Post trial gap',
      default: null,
      description: 'Length of gap between the end of this trial and the start of the next trial'
    }
  }
}
