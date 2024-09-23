import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuards implements CanMatch, CanActivate {



  constructor(private authService: AuthService, private router: Router) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthStatus()
    .pipe(
      tap(isAuthenticated => {
        if(isAuthenticated){
          this.router.navigate(['./']);
        }
      }),
      //? Invierte el valor de autenticación para permitir acceso público solo si no está autenticado
      map(isAuthenticated => !isAuthenticated)
    )
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStatus()
  }


  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

}
//TODO: Si no esta logueado, puede ver el login
//TODO: Si esta logueado, no puede ver el login

