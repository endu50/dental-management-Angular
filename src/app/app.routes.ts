import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LoginComponent } from './login/login.component';
import { RegisteraccountComponent } from './registeraccount/registeraccount.component';
import { HomeComponent } from './home/home.component';
import { AppointcrudComponent } from './appointcrud/appointcrud.component';
import { PatientcrudComponent } from './patientcrud/patientcrud.component';
import { AdminaccountComponent } from './adminaccount/adminaccount.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Home route
    { path: 'home', component: HomeComponent },
    { path: 'register', component: PatientRegisterComponent },
    { path: 'appointment', component: AppointmentComponent },
    { path: 'appointmentaction', component: AppointcrudComponent },
    { path: 'patientaction', component: PatientcrudComponent },
    { path: 'adminaccount', component: AdminaccountComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registeraccount', component: RegisteraccountComponent }
];
