import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sheet } from '../interfaces/sheet';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  sheets: Sheet[] = [];
  // urlBase = 'http://localhost:3001';
  urlBase = 'https://gb-web-service.onrender.com';

  constructor(private httpClient: HttpClient) { }

  getSheets(): Observable<{message: string, sheets: Sheet[] }>{
    return this.httpClient.get<{message: string, sheets: Sheet[] }>(`${this.urlBase}/sheets`);
  }
}
