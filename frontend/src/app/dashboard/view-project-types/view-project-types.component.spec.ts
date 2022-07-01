import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectTypesComponent } from './view-project-types.component';

describe('ViewProjectTypesComponent', () => {
  let component: ViewProjectTypesComponent;
  let fixture: ComponentFixture<ViewProjectTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProjectTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProjectTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
