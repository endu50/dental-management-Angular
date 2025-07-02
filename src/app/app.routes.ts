import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LoginComponent } from './login/login.component';
import { RegisteraccountComponent } from './registeraccount/registeraccount.component';
import { HomeComponent } from './home/home.component';
import { AppointcrudComponent } from './appointcrud/appointcrud.component';
import { PatientcrudComponent } from './patientcrud/patientcrud.component';
import { AdminaccountComponent } from './adminaccount/adminaccount.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendOtpComponentComponent } from './send-otp-component/send-otp-component.component';
import { VerifyOtpComponentComponent } from './verify-otp-component/verify-otp-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentsComponent } from './payments/payments.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Home route
    { path: 'home', component: HomeComponent },
     { path: 'dashboard', component: DashboardComponent },
    { path: 'register', component: PatientRegisterComponent },
    { path: 'appointment', component: AppointmentComponent },
    { path: 'appointmentaction', component: AppointcrudComponent },
    { path: 'patientaction', component: PatientcrudComponent },
    { path: 'adminaccount', component: AdminaccountComponent },
      { path: 'payment', component: PaymentsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'resetpassword', component: ForgetpasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'send-otp', component: SendOtpComponentComponent },
    { path: 'verify-otp', component: VerifyOtpComponentComponent },
    { path: 'registeraccount', component: RegisteraccountComponent }
];
