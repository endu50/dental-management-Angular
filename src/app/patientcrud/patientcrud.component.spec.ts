import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientcrudComponent } from './patientcrud.component';

describe('PatientcrudComponent', () => {
  let component: PatientcrudComponent;
  let fixture: ComponentFixture<PatientcrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientcrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
