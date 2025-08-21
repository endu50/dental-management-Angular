import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LoginComponent } from './login/login.component';
import { RegisteraccountComponent } from './registeraccount/registeraccount.component';
import { HomeComponent } from './home/home.component';
import { AppointcrudComponent } from './appointcrud/appointcrud.component';
import { PatientcrudComponent } from './patientcrud/patientcrud.component';
import { AdminaccountComponent } from './adminaccount/adminaccount.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendOtpComponentComponent } from './send-otp-component/send-otp-component.component';
import { VerifyOtpComponentComponent } from './verify-otp-component/verify-otp-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentsComponent } from './payments/payments.component';
import { RecieptComponent } from './reciept/reciept.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import {SupplyRegistrationComponent} from './supply-registration/supply-registration.component'
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: '', component: LoginComponent }, // Login route
    { path: 'home', component: HomeComponent , canActivate: [AuthGuard], data: { roles: ['User'] }},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    { path: 'register', component: PatientRegisterComponent , canActivate: [AuthGuard], data: { roles: ['User'] }},
    { path: 'appointment', component: AppointmentComponent , canActivate: [AuthGuard], data: { roles: ['User'] } },
    { path: 'appointmentaction', component: AppointcrudComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    { path: 'patientaction', component: PatientcrudComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'adminaccount', component: AdminaccountComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
       { path: 'change-password', component: ChangePasswordComponent },
        { path: 'payment', component: PaymentsComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
        { path: 'payment-detail', component: PaymentDetailComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
         { path: 'inventory-management', component: InventoryManagementComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] } },
          { path: 'stock-request', component: SupplyRegistrationComponent , canActivate: [AuthGuard], data: { roles: ['User'] }},
    { path: 'login', component: LoginComponent },
    { path: 'resetpassword', component: ForgetpasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'send-otp', component: SendOtpComponentComponent },
    { path: 'verify-otp', component: VerifyOtpComponentComponent },
    { path: 'registeraccount', component: RegisteraccountComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    { path: 'reciept', component: RecieptComponent }
];
