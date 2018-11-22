import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePassFormComponent } from './update-pass-form.component';

describe('UpdatePassFormComponent', () => {
  let component: UpdatePassFormComponent;
  let fixture: ComponentFixture<UpdatePassFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePassFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
