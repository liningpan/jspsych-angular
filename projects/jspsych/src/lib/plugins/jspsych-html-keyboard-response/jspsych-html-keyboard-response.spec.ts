import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JspsychHtmlKeyboardResponse } from './jspsych-html-keyboard-response'
import { JspsychComponent } from '../../jspsych.component';
import { EventService } from '../../event.service';

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
    fixture.detectChanges();
    component.trial = {
      stimulus: "<p id='simple-message'>Component Test</p>"
    }
    component.loadTrial();
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

describe('JspsychHtmlKeyboardResponse-in-main-component', () => {
  let component: JspsychComponent;
  let fixture: ComponentFixture<JspsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JspsychComponent, JspsychHtmlKeyboardResponse]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JspsychComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display simple message', () => {
    component.setCurrentTrial({
      type: "html-keyboard-response",
      stimulus: "<p id='simple-message'>Component Test</p>",
      prompt: "<p id='simple-prompt'>Prompt</p>"
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#simple-message').textContent).toContain('Component Test');
    expect(compiled.querySelector('#simple-prompt').textContent).toContain('Prompt');
  });

  it('should receive response', () => {
    component.setCurrentTrial({
      type: "html-keyboard-response",
      stimulus: "<p id='simple-message'>Component Test</p>",
      choices: ['f', 'j'],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#simple-message').textContent).toContain('Component Test');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: "f" }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: "f" }));
    fixture.detectChanges();

    expect(compiled.querySelector('#stimulus-container')).toHaveClass("responded");

  });
});
