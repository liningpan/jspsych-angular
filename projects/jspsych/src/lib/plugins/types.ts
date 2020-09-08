import { AbstractPlugin } from '../abstract-plugin';
import { Type } from '@angular/core';

export namespace plugins {
  export interface PluginInfo {
    readonly name: string;
    readonly parameters: Record<string, TrialParameter>;
    readonly description: string;
    readonly component: Type<AbstractPlugin>;
  }

  export interface TrialParameter {
    //name: string;
    pretty_name: string;
    type: parameterType;
    default?: any;
    description: string;
  }

  export enum parameterType {
    BOOL = 0,
    STRING = 1,
    INT = 2,
    FLOAT = 3,
    FUNCTION = 4,
    KEYCODE = 5,
    SELECT = 6,
    HTML_STRING = 7,
    IMAGE = 8,
    AUDIO = 9,
    VIDEO = 10,
    OBJECT = 11,
    COMPLEX = 12
  }
}
