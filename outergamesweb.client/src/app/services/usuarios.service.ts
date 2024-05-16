import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'https://localhost:7017/Usuarios';

  

}
