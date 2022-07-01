import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProjectsComponent } from './print-projects.component';

describe('PrintProjectsComponent', () => {
  let component: PrintProjectsComponent;
  let fixture: ComponentFixture<PrintProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
