import * as utils from '../core/utils'
import * as randomization from '../core/randomization'

export class TimelineNode {
  // a unique ID for this node, relative to the parent
  private relative_id;

  // store the parent for this node
  private parent_node;

  // parameters for the trial if the node contains a trial
  private trial_parameters;

  // parameters for nodes that contain timelines
  private timeline_parameters;

  // stores trial information on a node that contains a timeline
  // used for adding new trials
  private node_trial_data;

  // track progress through the node
  private progress = {
    current_location: -1, // where on the timeline (which timelinenode)
    current_variable_set: 0, // which set of variables to use from timeline_variables
    current_repetition: 0, // how many times through the variable set on this run of the node
    current_iteration: 0, // how many times this node has been revisited
    done: false,
    order: []
  }

  // recursively get the next trial to run.
  // if this node is a leaf (trial), then return the trial.
  // otherwise, recursively find the next trial in the child timeline.
  trial() {
    if (typeof this.timeline_parameters == 'undefined') {
      // returns a clone of the trial_parameters to
      // protect functions.
      return utils.deepCopy(this.trial_parameters);
    } else {
      if (this.progress.current_location >= this.timeline_parameters.timeline.length) {
        return null;
      } else {
        return this.timeline_parameters.timeline[this.progress.current_location].trial();
      }
    }
  }

  markCurrentTrialComplete() {
    if (typeof this.timeline_parameters == 'undefined') {
      this.progress.done = true;
    } else {
      this.timeline_parameters.timeline[this.progress.current_location].markCurrentTrialComplete();
    }
  }

  nextRepetiton() {
    this.setTimelineVariablesOrder();
    this.progress.current_location = -1;
    this.progress.current_variable_set = 0;
    this.progress.current_repetition++;
    for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
      this.timeline_parameters.timeline[i].reset();
    }
  }

  setTimelineVariablesOrder() {

    // check to make sure this node has variables
    if (typeof this.timeline_parameters === 'undefined' || typeof this.timeline_parameters.timeline_variables === 'undefined') {
      return;
    }

    var order = [];
    for (var i = 0; i < this.timeline_parameters.timeline_variables.length; i++) {
      order.push(i);
    }

    if (typeof this.timeline_parameters.sample !== 'undefined') {
      if (this.timeline_parameters.sample.type == 'custom') {
        order = this.timeline_parameters.sample.fn(order);
      } else if (this.timeline_parameters.sample.type == 'with-replacement') {
        order = randomization.sampleWithReplacement(
          order,
          this.timeline_parameters.sample.size,
          this.timeline_parameters.sample.weights);
      } else if (this.timeline_parameters.sample.type == 'without-replacement') {
        order = randomization.sampleWithoutReplacement(
          order,
          this.timeline_parameters.sample.size);
      } else if (this.timeline_parameters.sample.type == 'fixed-repetitions') {
        order = randomization.repeat(
          order,
          this.timeline_parameters.sample.size,
          false) as any[];
      } else if (this.timeline_parameters.sample.type == 'alternate-groups') {
        order = randomization.shuffleAlternateGroups(
          this.timeline_parameters.sample.groups,
          this.timeline_parameters.sample.randomize_group_order);
      } else {
        console.error('Invalid type in timeline sample parameters. Valid options for type are "custom", "with-replacement", "without-replacement", "fixed-repetitions", and "alternate-groups"');
      }
    }

    if (this.timeline_parameters.randomize_order) {
      order = randomization.shuffle(order);
    }

    this.progress.order = order;
  }

  // next variable set
  nextSet() {
    this.progress.current_location = -1;
    this.progress.current_variable_set++;
    for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
      this.timeline_parameters.timeline[i].reset();
    }
  }

  // update the current trial node to be completed
  // returns true if the node is complete after advance (all subnodes are also complete)
  // returns false otherwise
  advance() {

    // first check to see if done
    if (this.progress.done) {
      return true;
    }

    // if node has not started yet (progress.current_location == -1),
    // then try to start the node.
    if (this.progress.current_location == -1) {
      // check for conditional function on nodes with timelines
      if (typeof this.timeline_parameters != 'undefined') {
        if (typeof this.timeline_parameters.conditional_function !== 'undefined') {
          var conditional_result = this.timeline_parameters.conditional_function();
          // if the conditional_function() returns false, then the timeline
          // doesn't run and is marked as complete.
          if (conditional_result == false) {
            this.progress.done = true;
            return true;
          }
          // if the conditonal_function() returns true, then the node can start
          else {
            this.progress.current_location = 0;
          }
        }
        // if there is no conditional_function, then the node can start
        else {
          this.progress.current_location = 0;
        }
      }
      // if the node does not have a timeline, then it can start
      this.progress.current_location = 0;
      // call advance again on this node now that it is pointing to a new location
      return this.advance();
    }

    // if this node has a timeline, propagate down to the current trial.
    if (typeof this.timeline_parameters !== 'undefined') {

      var have_node_to_run = false;
      // keep incrementing the location in the timeline until one of the nodes reached is incomplete
      while (this.progress.current_location < this.timeline_parameters.timeline.length && have_node_to_run == false) {

        // check to see if the node currently pointed at is done
        var target_complete = this.timeline_parameters.timeline[this.progress.current_location].advance();
        if (!target_complete) {
          have_node_to_run = true;
          return false;
        } else {
          this.progress.current_location++;
        }

      }

      // if we've reached the end of the timeline (which, if the code is here, we have)
      // there are a few steps to see what to do next...

      // first, check the timeline_variables to see if we need to loop through again
      // with a new set of variables
      if (this.progress.current_variable_set < this.progress.order.length - 1) {
        // reset the progress of the node to be with the new set
        this.nextSet();
        // then try to advance this node again.
        return this.advance();
      }

      // if we're all done with the timeline_variables, then check to see if there are more repetitions
      else if (this.progress.current_repetition < this.timeline_parameters.repetitions - 1) {
        this.nextRepetiton();
        return this.advance();
      }

      // if we're all done with the repetitions, check if there is a loop function.
      else if (typeof this.timeline_parameters.loop_function !== 'undefined') {
        if (this.timeline_parameters.loop_function(this.generatedData())) {
          this.reset();
          return this.parent_node.advance();
        } else {
          this.progress.done = true;
          return true;
        }
      }

      // no more loops on this timeline, we're done!
      else {
        this.progress.done = true;
        return true;
      }

    }
  }

  isComplete() {
    return this.progress.done;
  }

  // getter method for timeline variables
  getTimelineVariableValue(variable_name) {
    if (typeof this.timeline_parameters == 'undefined') {
      return undefined;
    }
    return this.timeline_parameters.timeline_variables[
      this.progress.order[this.progress.current_variable_set]
    ][variable_name];
  }

  // recursive upward search for timeline variables
  findTimelineVariable(variable_name) {
    var v = this.getTimelineVariableValue(variable_name);
    if (typeof v == 'undefined') {
      if (typeof this.parent_node !== 'undefined') {
        return this.parent_node.findTimelineVariable(variable_name);
      } else {
        return undefined;
      }
    } else {
      return v;
    }
  }

  // recursive downward search for active trial to extract timeline variable
  timelineVariable(variable_name) {
    if (typeof this.timeline_parameters == 'undefined') {
      return this.findTimelineVariable(variable_name);
    } else {
      // if progress.current_location is -1, then the timeline variable is being evaluated
      // in a function that runs prior to the trial starting, so we should treat that trial
      // as being the active trial for purposes of finding the value of the timeline variable
      var loc = Math.max(0, this.progress.current_location);
      return this.timeline_parameters.timeline[loc].timelineVariable(variable_name);
    }
  }

  // recursively get the number of **trials** contained in the timeline
  // assuming that while loops execute exactly once and if conditionals
  // always run
  length() {
    var length = 0;
    if (typeof this.timeline_parameters !== 'undefined') {
      for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
        length += this.timeline_parameters.timeline[i].length();
      }
    } else {
      return 1;
    }
    return length;
  }


  // return the percentage of trials completed, grouped at the first child level
  // counts a set of trials as complete when the child node is done
  percentComplete = function () {
    var total_trials = this.length();
    var completed_trials = 0;
    for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
      if (this.timeline_parameters.timeline[i].isComplete()) {
        completed_trials += this.timeline_parameters.timeline[i].length();
      }
    }
    return (completed_trials / total_trials * 100)
  }

  // resets the node and all subnodes to original state
  // but increments the current_iteration counter
  reset = function () {
    this.progress.current_location = -1;
    this.progress.current_repetition = 0;
    this.progress.current_variable_set = 0;
    this.progress.current_iteration++;
    this.progress.done = false;
    this.setTimelineVariablesOrder();
    if (typeof this.timeline_parameters != 'undefined') {
      for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
        this.timeline_parameters.timeline[i].reset();
      }
    }

  }

  // mark this node as finished
  end() {
    this.progress.done = true;
  }

  // recursively end whatever sub-node is running the current trial
  endActiveNode() {
    if (typeof this.timeline_parameters == 'undefined') {
      this.end();
      this.parent_node.end();
    } else {
      this.timeline_parameters.timeline[this.progress.current_location].endActiveNode();
    }
  }

  // get a unique ID associated with this node
  // the ID reflects the current iteration through this node.
  ID() {
    var id = "";
    if (typeof this.parent_node == 'undefined') {
      return "0." + this.progress.current_iteration;
    } else {
      id += this.parent_node.ID() + "-";
      id += this.relative_id + "." + this.progress.current_iteration;
      return id;
    }
  }

  // get the ID of the active trial
  activeID() {
    if (typeof this.timeline_parameters == 'undefined') {
      return this.ID();
    } else {
      return this.timeline_parameters.timeline[this.progress.current_location].activeID();
    }
  }

  // get all the data generated within this node
  generatedData() {
    // TODO: How to get global data store? through data service
    //return data.getDataByTimelineNode(this.ID());
  }

  // get all the trials of a particular type
  trialsOfType(type) {
    if (typeof this.timeline_parameters == 'undefined') {
      if (this.trial_parameters.type == type) {
        return this.trial_parameters;
      } else {
        return [];
      }
    } else {
      var trials = [];
      for (var i = 0; i < this.timeline_parameters.timeline.length; i++) {
        var t = this.timeline_parameters.timeline[i].trialsOfType(type);
        trials = trials.concat(t);
      }
      return trials;
    }
  }

  // add new trials to end of this timeline
  insert(parameters) {
    if (typeof this.timeline_parameters == 'undefined') {
      console.error('Cannot add new trials to a trial-level node.');
    } else {
      this.timeline_parameters.timeline.push(
        new TimelineNode(Object.assign({}, this.node_trial_data, parameters), this, this.timeline_parameters.timeline.length)
      );
    }
  }

  constructor(parameters, parent?: TimelineNode, relativeID?: number) {

    // store a link to the parent of this node
    this.parent_node = parent;

    // create the ID for this node
    if (typeof parent == 'undefined') {
      this.relative_id = 0;
    } else {
      this.relative_id = relativeID;
    }

    // check if there is a timeline parameter
    // if there is, then this node has its own timeline
    if ((typeof parameters.timeline !== 'undefined') /*|| (typeof jsPsych.plugins[trial_type] == 'function')*/) {

      // create timeline properties
      this.timeline_parameters = {
        timeline: [],
        loop_function: parameters.loop_function,
        conditional_function: parameters.conditional_function,
        sample: parameters.sample,
        randomize_order: typeof parameters.randomize_order == 'undefined' ? false : parameters.randomize_order,
        repetitions: typeof parameters.repetitions == 'undefined' ? 1 : parameters.repetitions,
        timeline_variables: typeof parameters.timeline_variables == 'undefined' ? [{}] : parameters.timeline_variables
      };

      this.setTimelineVariablesOrder();

      // extract all of the node level data and parameters
      var node_data = Object.assign({}, parameters);
      delete node_data.timeline;
      delete node_data.conditional_function;
      delete node_data.loop_function;
      delete node_data.randomize_order;
      delete node_data.repetitions;
      delete node_data.timeline_variables;
      delete node_data.sample;
      this.node_trial_data = node_data; // store for later...

      // create a TimelineNode for each element in the timeline
      for (var i = 0; i < parameters.timeline.length; i++) {
        // merge parameters
        var merged_parameters = Object.assign({}, node_data, parameters.timeline[i]);
        // merge any data from the parent node into child nodes
        if (typeof node_data.data == 'object' && typeof parameters.timeline[i].data == 'object') {
          var merged_data = Object.assign({}, node_data.data, parameters.timeline[i].data);
          merged_parameters.data = merged_data;
        }
        this.timeline_parameters.timeline.push(new TimelineNode(merged_parameters, this, i));
      }
    }
    // if there is no timeline parameter, then this node is a trial node
    else {
      //TODO: How to find available plugins
      // check to see if a valid trial type is defined
      var trial_type = parameters.type;
      if (typeof trial_type == 'undefined') {
        console.error('Trial level node is missing the "type" parameter. The parameters for the node are: ' + JSON.stringify(parameters));
      } else if (/*(typeof jsPsych.plugins[trial_type] == 'undefined') &&*/ (trial_type.toString().replace(/\s/g, '') != "function(){returntimeline.timelineVariable(varname);}")) {
        console.error('No plugin loaded for trials of type "' + trial_type + '"');
      }
      // create a deep copy of the parameters for the trial
      this.trial_parameters = Object.assign({}, parameters);
    }
  }
}
