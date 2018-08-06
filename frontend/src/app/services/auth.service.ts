import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_URL } from '../env';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${API_URL}/auth/login`, { username: username, password: password })
            .pipe(tap(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    localStorage.setItem('jwt-token', user.token);
                }
            }));
    }

    logout(redirect: boolean = false) {
        localStorage.removeItem('jwt-token');
        if (redirect) {
            this.router.navigate(['/login']);
        }
    }

    getToken() {
        return localStorage.getItem('jwt-token');
    }
}
