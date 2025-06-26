
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

export interface Patient {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://localhost:5139/api/patient';

  constructor(private http: HttpClient) {}

  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(this.baseUrl, patient);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  getAllPatients():Observable<Patient[]> {

    return this.http.get<Patient[]>(this.baseUrl);
  }
  getPatientId(id: number):Observable<Patient[]>{

    return this,this.http.get<Patient[]>(`${this.baseUrl} /${id}`);
  }

  updatePatient(patient: Patient):Observable<Patient>{

    const url= `${this.baseUrl}/${patient.id}`;

   return  this.http.put<Patient>(url, patient);
  }
  deletePatient(id:number):Observable<void>{

    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
