import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyRegistrationComponent } from './supply-registration.component';

describe('SupplyRegistrationComponent', () => {
  let component: SupplyRegistrationComponent;
  let fixture: ComponentFixture<SupplyRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
