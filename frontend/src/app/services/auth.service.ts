import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { throwError, Subject, Observable, of } from 'rxjs';


@Injectable()
export class AuthService {
    public loginEvent = new Subject<string>();
    public logoutEvent = new Subject<void>();
    private loggedInUser: User = null;

    constructor(private http: HttpClient, private router: Router) { }

    public login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username: username, password: password })
            .pipe(tap(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    localStorage.setItem('jwt-token', user.token);
                    this.loggedInUser = user;
                    this.loginEvent.next(user.token);
                }
            }));
    }

    public logout(redirect: boolean = false): void {
        localStorage.removeItem('jwt-token');
        this.loggedInUser = null;
        this.logoutEvent.next();

        if (redirect) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        }
    }

    public getToken(): string {
        return localStorage.getItem('jwt-token');
    }

    public getLoggedInUser(): Observable<User> {
        if (this.loggedInUser) {
            return of(this.loggedInUser);
        }

        const token = this.getToken();
        if (token) {
            return this.http.get<User>(`${environment.apiUrl}/auth/loggedin`)
                .pipe(tap(user => this.loggedInUser = user));
        }

        return throwError('Not logged in!');
    }
}
