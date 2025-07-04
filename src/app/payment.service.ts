import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface payment {
  amount: number;
  method: string;
  datePayment: Date;
  patientId: string;
  paymentDescription: string;
  paymentStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
   private baseUrl = 'http://localhost:5139/api/Payment';

   payments : payment []=[];

  constructor(private http: HttpClient) { }

getPayment():Observable<payment[]>
{
  return this.http.get<payment[]>(this.baseUrl);
}

createPayment(payments: payment):Observable<any>{

  return this.http.post(this.baseUrl ,payments);
}


  generateReceipt(data: payment): Observable<payment> {
    return this.http.post<payment>(`${this.baseUrl}/generate`, data);
  }
}