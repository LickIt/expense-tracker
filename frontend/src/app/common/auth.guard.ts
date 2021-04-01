import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.getToken()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
