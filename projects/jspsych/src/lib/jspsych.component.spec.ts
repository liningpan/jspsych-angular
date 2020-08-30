import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JspsychComponent } from './jspsych.component';

describe('JspsychComponent', () => {
  let component: JspsychComponent;
  let fixture: ComponentFixture<JspsychComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JspsychComponent ]
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
});
