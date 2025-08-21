import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Appoint {
  appointId?: number;
  patientName: string;
  phone :number;
  appointmentDate: Date;
  treatmentType: string;
  dentistName: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointService {
  private baseUrl = 'http://localhost:5139/api/appoint';

  constructor(private http: HttpClient) {}

    // Optionally: Get all appointments
 getAllAppointments(): Observable<Appoint[]> {
   return this.http.get<Appoint[]>(this.baseUrl);
        }

  createAppointment(data: Appoint): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
    // Get appointment by ID
    getAppointById(id: number): Observable<Appoint> {
      return this.http.get<Appoint>(`${this.baseUrl}/${id}`);
    }
  
    // Delete appointment by ID
    deleteAppoint(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    updateAppoint(appointment: Appoint): Observable<Appoint> {
      const url = `${this.baseUrl}/${appointment.appointId}`;
      return this.http.put<Appoint>(url, appointment);
    }

}
