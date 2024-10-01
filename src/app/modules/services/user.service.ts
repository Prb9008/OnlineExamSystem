import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:5000/api/user';  // Backend URL

  constructor(private http: HttpClient) {}

  // Fetch user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  // Update user profile
  updateProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/profile`, formData);
  }

  // Fetch user statistics for dashboard
  getUserStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }
}
