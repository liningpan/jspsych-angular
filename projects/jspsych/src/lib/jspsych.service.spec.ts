import { TestBed } from '@angular/core/testing';

import { JspsychService } from './jspsych.service';

describe('JspsychService', () => {
  let service: JspsychService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JspsychService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
