import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointService } from '../appoint.service';
import { Appoint } from '../appoint.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  /**
   *
   */
Appoints: Appoint[] = [];  // Assuming you already have this
Reports: any[] = []; // Replace 'any' with actual Report model if available
constructor(private appointsService: AppointService , private router:Router){}

ngOnInit(): void {
  this.loadAppointments();

}

loadAppointments() {
  this.appointsService.getAllAppointments().subscribe({
    next: (data) => this.Appoints = data,
    error: (err) => console.error('Error loading appointments', err)
  });
}

// loadReports() {
//   this.reportService.getAllReports().subscribe({
//     next: (data) => this.Reports = data,
//     error: (err) => console.error('Error loading reports', err)
//   });
// }

Onappoint() {
  // Navigate to Appointment Booking Page
  this.router.navigate(['/appointment']);
}

}
