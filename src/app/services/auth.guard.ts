import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  
  constructor(
    private authService:AuthService,
     private router:Router,
     private toastr:ToastrService
     
     ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

  if(this.authService.isLoggedInGuard){
    console.log('Access Granted ..')
    return true;
  }else{
    this.toastr.warning('You dont have permission to access this page ..')
    this.router.navigate(['/login'])
    return false;
  }

  }
}