import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

ngOnInit(): void {
  this.token = this.route.snapshot.queryParamMap.get('token') || '';
  console.log('Token from URL:', this.token);  // Make sure this is NOT empty
}

  onSubmit() {
    if (this.form.valid && this.form.value.newPassword === this.form.value.confirmPassword) {
      this.auth.resetPassword(this.token, this.form.value.newPassword).subscribe({
        next: () => alert('Password reset successful'),
        error: (err) => {// Properly show the error
    console.error('Reset password error:', err);
    alert("Error: " + (err?.error?.message || err?.message || "Something went wrong"))
      }
    });
    }
  }
}
