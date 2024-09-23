import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments.prod.';

@Injectable({ providedIn: 'root' })

export class HeroesService {

  //! Usando la variable de entorno
  private baseUrl: string = environments.baseURL;

  //! Inyectando el HttpClient
  constructor(private http: HttpClient) { }

  //! Obtiene todos los héroes
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }
  //! Obtiene un héroe por su id
  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      )
  }

  //! Obtiene sugerencias de héroes
  getSuggestions(query:string): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limits=5`)
  }

  //! Agrega un nuevo héroe
  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero); //? Agrega un nuevo héroe
  }

//! Actualiza un héroe existente por su id
  updateHero(hero: Hero): Observable<Hero>{
    if(!hero.id) throw Error('Hero id is required'); //? Si no tiene id, lanza un error
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero); //? Si tiene id, actualiza el héroe
  }

  //! Elimina un héroe por su id, devuelve un booleano indicando si se eliminó o no
  deleteHeroById(id: string): Observable<boolean>{
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
      .pipe( //? Utiliza el método pipe para manejar la respuesta del Observable
        catchError(err => of(false)), //? Si ocurre un error, captura la excepción y devuelve un Observable con false
        map(resp => true) //? Si la petición es exitosa, mapea la respuesta a true
      );
  }
}

