import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Videojuego } from '../interfaces/videojuego';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {
  private apiUrl = 'https://localhost:7017/Videogames';
  
  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T); 
    };
  }

  getAllVideojuegos(): Observable<Videojuego[]> {
    const url = `${this.apiUrl}/GetVideogames`;
    return this.http.get<Videojuego[]>(url).pipe(
      catchError(this.handleError<Videojuego[]>('getAllVideojuegos',[]))
    );
  }

  getVideojuegosById(id: number): Observable<Videojuego> {
    const url = `${this.apiUrl}/GetVideogameById/${id}`;
    return this.http.get<Videojuego>(url).pipe(
      catchError(this.handleError<Videojuego>('getVideojuegosById'))
    );
  }

  getVideojuegosByGenre(genre: string): Observable<Videojuego[]> {
    const url = `${this.apiUrl}/GetVideogamesByGenre/${genre}`;
    return this.http.get<Videojuego[]>(url).pipe(
      catchError(this.handleError<Videojuego[]>('getVideojuegosByGenre'))
    );
  }

  getVideojuegosByPlatform(plataforma: string): Observable<Videojuego[]> {
    const url = `${this.apiUrl}/GetVideogamesByPlatform/${plataforma}`;
    return this.http.get<Videojuego[]>(url).pipe(
      catchError(this.handleError<Videojuego[]>('getVideojuegosByPlatform'))
    );
  }

  getVideojuegosByName(nombre: string): Observable<Videojuego[]> {
    const url = `${this.apiUrl}/GetByName/${nombre}`;
    return this.http.get<Videojuego[]>(url).pipe(
      catchError(this.handleError<Videojuego[]>('getVideojuegosByName'))
    );
  }

  getVideojuegosByPriceRange(minPrice: number, maxPrice: number): Observable<Videojuego[]> {
    const url = `${this.apiUrl}/GetByPriceRange/${minPrice}/${maxPrice}`;
    return this.http.get<Videojuego[]>(url).pipe(
      catchError(this.handleError<Videojuego[]>('getVideojuegosByPriceRange'))
    );
  }

  //CRUD
  createVideojuego(videojuego: Videojuego): Observable<Videojuego> {
    return this.http.post<Videojuego>(`${this.apiUrl}/Create`, videojuego).pipe(
      catchError(this.handleError<Videojuego>('createVideojuego'))
    );
  }

  editVideojuego(id: number, videojuego: Videojuego): Observable<Videojuego> {
    const url = `${this.apiUrl}/Edit/${id}`;
    return this.http.put<Videojuego>(url, videojuego).pipe(
      catchError(this.handleError<Videojuego>('editVideojuego'))
    );
  }

  deleteVideojuego(id: number): Observable<any> {
    const url = `${this.apiUrl}/Delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError<Videojuego>('deleteVideojuego'))
    );
  }

}

