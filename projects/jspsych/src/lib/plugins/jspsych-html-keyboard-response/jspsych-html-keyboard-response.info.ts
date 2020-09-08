import { plugins } from '../types';
import { JspsychHtmlKeyboardResponse } from './jspsych-html-keyboard-response';

export class JspsychHtmlKeyboardResponseInfo implements plugins.PluginInfo {
  name = "html-keyboard-response";
  parameters = {
    stimulus: {
      type: plugins.parameterType.HTML_STRING,
      pretty_name: 'Stimulus',
      default: undefined,
      description: 'The HTML string to be displayed'
    },
    choices: {
      type: plugins.parameterType.KEYCODE,
      array: true,
      pretty_name: 'Choices',
      default: "allkeys",//jsPsych.ALL_KEYS,
      description: 'The keys the subject is allowed to press to respond to the stimulus.'
    },
    prompt: {
      type: plugins.parameterType.STRING,
      pretty_name: 'Prompt',
      default: null,
      description: 'Any content here will be displayed below the stimulus.'
    },
    stimulus_duration: {
      type: plugins.parameterType.INT,
      pretty_name: 'Stimulus duration',
      default: null,
      description: 'How long to hide the stimulus.'
    },
    trial_duration: {
      type: plugins.parameterType.INT,
      pretty_name: 'Trial duration',
      default: null,
      description: 'How long to show trial before it ends.'
    },
    response_ends_trial: {
      type: plugins.parameterType.BOOL,
      pretty_name: 'Response ends trial',
      default: true,
      description: 'If true, trial will end when subject makes a response.'
    }
  };
  desciption = "";
  component = JspsychHtmlKeyboardResponse;
}
