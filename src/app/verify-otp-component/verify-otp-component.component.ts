import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
@Component({
  selector: 'app-verify-otp-component',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-otp-component.component.html',
  styleUrl: './verify-otp-component.component.css'
})
export class VerifyOtpComponentComponent {

  form: FormGroup;
  message = '';
  phone: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.phone = localStorage.getItem('otpPhone') || '';
  }

  onSubmit() {
    const otp = this.form.value.otp;
    this.auth.verifyOtp(this.phone, otp).subscribe({
      next: () => {
        this.message = 'OTP verified successfully!';
        // Proceed to next step, e.g., login or dashboard
      },
      error: (err) => {
        this.message = 'Invalid OTP!';
        console.error(err);
      }
    });
  }
}
