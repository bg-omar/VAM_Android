import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api/derivative/calculate'; // Adjust as needed
  constructor(private http: HttpClient) { }

  calculateDerivative(inputFunction: string): Observable<any> {
    return this.http.post(this.apiUrl, { function: inputFunction });
  }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
