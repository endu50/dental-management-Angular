import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-otp-component',
  imports: [ReactiveFormsModule],
  templateUrl: './send-otp-component.component.html',
  styleUrl: './send-otp-component.component.css'
})
export class SendOtpComponentComponent {

  otpForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.otpForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]]
    });
  }

  onSubmit() {
    const phone = this.otpForm.value.phoneNumber;
    this.auth.sendOtp(phone).subscribe({
      next: (res) => {
        this.message = 'OTP sent!';
        localStorage.setItem('otpPhone', phone); // Save for next step
        this.router.navigate(['/verify-otp']);
      },
      error: (err) => {
        this.message = 'Failed to send OTP.';
        console.error(err);
      }
    });
  }
}
