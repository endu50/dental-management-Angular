import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOtpComponentComponent } from './send-otp-component.component';

describe('SendOtpComponentComponent', () => {
  let component: SendOtpComponentComponent;
  let fixture: ComponentFixture<SendOtpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendOtpComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOtpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
