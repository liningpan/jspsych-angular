import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JspsychComponent } from './jspsych.component';
import { PluginAPIService } from './plugin-api.service';

describe('JspsychComponent', () => {
  let component: JspsychComponent;
  let fixture: ComponentFixture<JspsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JspsychComponent ],
      providers: [ PluginAPIService ]
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
});
