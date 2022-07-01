import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectDetailComponent } from './student-project-detail.component';

describe('StudentProjectDetailComponent', () => {
  let component: StudentProjectDetailComponent;
  let fixture: ComponentFixture<StudentProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProjectDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
