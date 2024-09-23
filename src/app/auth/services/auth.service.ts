import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit{

  private baseUrl:string = environments.baseURL;
  private user?:User;



  constructor(private http: HttpClient) { }
  ngOnInit(): void {

  }

  checkAuthStatus():Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => this.user = user),
      map(user => !!user), //TODO: Retorna true si el usuario existe
      catchError(err => of(false)) //TODO: Retorna false si el usuario no existe
    )
  }


  get currentUser():User | undefined{
    if(!this.user) return undefined;
    //TODO: retornar un clon del usuario ya no se usa el operador spread {...this.user}
    return structuredClone(this.user);
  }

  login(email:string, password:string):Observable<User>{
    //TODO: Estoy regresando un usuario fijo, en un futuro se debe de cambiar por la llamada http
    //TODO: http.post('login', {email, password})
    //TODO: Si la llamada es exitosa, se debe de guardar el token en el localStorage
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => this.user = user),
      tap(user => localStorage.setItem('token', 'asdasdasd.asdasdasd.asdasdasd'))
    )

  }

  //TODO: Borrar el token del localStorage, cuando el usuario cierra sesión
  logout(){
    this.user = undefined;
    localStorage.removeItem('token');
  }


}
