import { Timeline } from './timeline-interface';
import { TimelineNode } from './timeline-node';

/**
 * Provide standardized timeline interface
 * Provide locally evaluated timeline
 * Hide recursive evaluation from highlevel api
 * Process timeline persistence
 */
export class LocalTimeline implements Timeline {

  private timelineNode: TimelineNode;

  constructor(timeline_parameters: object) {
    this.timelineNode = new TimelineNode(timeline_parameters);
  }

  activeID(): string {
    return this.timelineNode.activeID();
  }
  advance(): boolean {
    return this.timelineNode.advance();
  }
  end(): void {
    this.timelineNode.end();
  }
  endActiveNode(): void {
    this.timelineNode.endActiveNode();
  }
  markCurrentTrialComplete(): void {
    this.timelineNode.markCurrentTrialComplete();
  }
  timelineVariable(variable_name: string): any {
    return this.timelineNode.timelineVariable(variable_name);
  }
  trial(): object {
    return this.timelineNode.trial();
  }
  insert(parameters: object): void {
    this.timelineNode.insert(parameters);
  }

}


