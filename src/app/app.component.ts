import { Component } from '@angular/core';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './appointment/appointment.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DentalDanaClinick';
}
