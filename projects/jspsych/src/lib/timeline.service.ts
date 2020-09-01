import { Injectable } from '@angular/core';
import { Timeline } from './timeline/timeline-interface';
import { LocalTimeline } from './timeline/local-timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private timeline: Timeline;

  constructor() {
    this.timeline = new LocalTimeline({});
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
