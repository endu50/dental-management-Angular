import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-otp-component',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './send-otp-component.component.html',
  styleUrl: './send-otp-component.component.css'
})
export class SendOtpComponentComponent {
  otpForm!: FormGroup;
  showCodeInput = false;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^2519\\d{8}$')]],
      code: ['']
    });
  }

  requestOtp() {
    const phone = this.otpForm.value.phoneNumber;

    this.loading = true;
 this.http.post('http://localhost:5139/api/auth/send-otp', { phoneNumber: phone }, {
  headers: { 'Content-Type': 'application/json' },
  responseType: 'text'
}).subscribe({
  next: () => {
    this.loading = false;
    this.showCodeInput = true;
    this.message = 'OTP sent to your phone.';
  },
  error: (err) => {
    this.loading = false;
    this.message = 'Failed to send OTP.';
    console.error(err);
  }
});

  }
}
