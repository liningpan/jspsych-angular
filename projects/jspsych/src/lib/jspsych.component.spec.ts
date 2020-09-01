import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JspsychComponent } from './jspsych.component';
import { EventService } from './event.service';

describe('JspsychComponent', () => {
  let component: JspsychComponent;
  let fixture: ComponentFixture<JspsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JspsychComponent ],
      providers: [
        EventService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JspsychComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('jspsych works!');
  });

  it('should detect keydown event', () => {
    let debugElement = fixture.debugElement;
    let eventService = debugElement.injector.get(EventService);
    const spy = spyOn(eventService, 'root_keydown_listener');
    const event = new KeyboardEvent("keydown",{
        "key": "Enter"
    });
    window.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });
});
