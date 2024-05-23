import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'https://localhost:7017/Usuarios';

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getUserById(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/GetUserById/${userId}`);
  }

  editUser(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.apiUrl}/EditUser/${id}`;
    return this.http.post<Usuario>(url, usuario).pipe(
      catchError(this.handleError<Usuario>('editUser'))
    );
  }

  updateEmail(userId: number, email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' 
    });
    return this.http.post<any>(`${this.apiUrl}/EditUser/${userId}/UpdateEmail`, JSON.stringify(email), { headers });
  }

  updateAddress(userId: number, address: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' 
    });
    return this.http.post<any>(`${this.apiUrl}/EditUser/${userId}/UpdateAddress`, JSON.stringify(address), { headers });
  }

  updatePassword(userId: number, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' 
    });
    return this.http.post<any>(`${this.apiUrl}/EditUser/${userId}/UpdatePassword`, JSON.stringify(password), { headers });
  }

}
