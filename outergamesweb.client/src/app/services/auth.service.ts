import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7017/Auth/'

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

  register(user: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}register`, user);
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}login`, credentials).subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/']);
    });
  }

  forgotPassword(email: any) {
    return this.http.post(`${this.baseUrl}forgot-password`, email);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
