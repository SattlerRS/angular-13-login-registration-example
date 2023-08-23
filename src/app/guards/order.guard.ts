import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { OrdersService } from '../_services/orders.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderGuard implements CanActivate {
  
  constructor(private router: Router,private token: TokenStorageService, private ordersService : OrdersService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Prüfe die Benutzerrolle im Session Storage
    const User = this.token.getUser();

    return this.ordersService.getOrdersFromUser(User.id).pipe(
      map((data: any) => {

          const isEmpty = data.orders.length === 0;
        if (isEmpty) {
          this.router.navigate(['/home']); // Weiterleitung zur Warenkorbseite
        }
        return !isEmpty; // Erlaube Zugriff, wenn der Warenkorb nicht leer ist
      }),
      catchError(error => {
        console.log(error.message);
        return of(false);
      })
    );
  }
}