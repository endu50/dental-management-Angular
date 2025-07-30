import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Supply {
  id?: number;
  itemName: string;
  category: string;  // e.g., "Glove", "Medicine", "Equipment"
  quantity: number;
  unit: string; // e.g., "Box", "Pieces", "Bottles"
  reorderLevel: number; // Minimum quantity before low-stock alert
}


@Injectable({ providedIn: 'root' })
export class SupplyService {
  private apiUrl = 'http://localhost:5139/api/supply';

  constructor(private http: HttpClient) {}

  getAllSupplies(): Observable<Supply[]> {
    return this.http.get<Supply[]>(this.apiUrl);
  }

  addSupply(supply: Supply): Observable<Supply> {
    return this.http.post<Supply>(this.apiUrl, supply);
  }

  updateSupply(supply: Supply): Observable<Supply> {
    return this.http.put<Supply>(`${this.apiUrl}/${supply.id}`, supply);
  }

  deleteSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
