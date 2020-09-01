export interface Timeline {
  activeID(): string;
  advance(): boolean;
  end(): void;
  endActiveNode(): void;
  markCurrentTrialComplete(): void;
  timelineVariable(variable_name: string): any;
  trial(): object;
  insert(parameters: object): void;
}

