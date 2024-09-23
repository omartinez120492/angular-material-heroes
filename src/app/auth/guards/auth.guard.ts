import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanMatch,
  RouterStateSnapshot, GuardResult, MaybeAsync,
  Route, UrlSegment,
  Router,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router) { }


  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthStatus()
    .pipe(
      tap(isAuthenticated => {
        if(!isAuthenticated){
          //TODO: console.log('No autenticado', isAuthenticated);
          this.router.navigate(['./auth/login']);
        }
      })
    )
  }



  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean>  {
    return this.checkAuthStatus();
  }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }




}
