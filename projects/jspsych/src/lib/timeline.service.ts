import { Injectable } from '@angular/core';
import { Timeline } from './timeline/timeline-interface';
import { LocalTimeline } from './timeline/local-timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService implements Timeline {
  private timeline: Timeline;

  constructor() {
    this.timeline = new LocalTimeline({});
  }
  activeID(): string {
    throw new Error("Method not implemented.");
  }
  advance(): boolean {
    throw new Error("Method not implemented.");
  }
  end(): void {
    throw new Error("Method not implemented.");
  }
  endActiveNode(): void {
    throw new Error("Method not implemented.");
  }
  markCurrentTrialComplete(): void {
    throw new Error("Method not implemented.");
  }
  timelineVariable(variable_name: string) {
    throw new Error("Method not implemented.");
  }
  trial(): object {
    throw new Error("Method not implemented.");
  }
  insert(parameters: object): void {
    throw new Error("Method not implemented.");
  }

  progress() {
    return {
      current_trial_global: null
    }
  }
  currentTrial() {
    return {
      type: null,
      data: null
    }
  }
  totalTime() {

  }
  currentTimelineNodeID() {

  }
}
