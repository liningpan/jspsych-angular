import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JspsychHtmlKeyboardResponse } from './jspsych-html-keyboard-response'

describe('JspsychHtmlKeyboardResponse', () => {
  let component: JspsychHtmlKeyboardResponse;
  let fixture: ComponentFixture<JspsychHtmlKeyboardResponse>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JspsychHtmlKeyboardResponse],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JspsychHtmlKeyboardResponse);
    component = fixture.componentInstance;
    component.trial = {
      stimulus: "<p id='simple-message'>Component Test</p>"
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display simple message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#simple-message').textContent).toContain('Component Test');
  });

});
