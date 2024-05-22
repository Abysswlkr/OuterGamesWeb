import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'https://localhost:7017/Usuarios';

  getUserById(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/GetUserById/${userId}`);
  }

}
