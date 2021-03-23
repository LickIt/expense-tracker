import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../models/user.model';
import {Subject} from 'rxjs';


@Injectable()
export class AuthService {
    public loginEvent = new Subject<string>();
    public logoutEvent = new Subject<void>();
    private loggedInUser: User = null;

    constructor() {
    }

    public redirectToLogin(): void {
        const redirectUri = `${window.location.origin}/login`;
        let loginUrl = `${environment.authUrl}/oauth2/authorize`;
        loginUrl += `?client_id=${environment.clientId}`;
        loginUrl += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
        loginUrl += `&response_type=token`;
        loginUrl += `&response_mode=query`;

        window.location.href = loginUrl;
    }

    public login(accessToken: string): void {
        localStorage.setItem('jwt-token', accessToken);
        this.loggedInUser = AuthService.getUserFromToken(accessToken);
        this.loginEvent.next(accessToken);
    }

    public logout(redirect: boolean = false): void {
        localStorage.removeItem('jwt-token');
        this.loggedInUser = null;
        this.logoutEvent.next();

        if (redirect) {
            const redirectUri = `${window.location.origin}/login`;
            let logoutUrl = `${environment.authUrl}/logout`;
            logoutUrl += `?response_type=token`;
            logoutUrl += `&client_id=${environment.clientId}`;
            logoutUrl += `&redirect_uri=${encodeURIComponent(redirectUri)}`;

            window.location.href = logoutUrl;
        }
    }

    public getToken(): string {
        return localStorage.getItem('jwt-token');
    }

    public getLoggedInUser(): User | undefined {
        if (this.loggedInUser) {
            return this.loggedInUser;
        }

        const token = this.getToken();
        if (token) {
            let user = AuthService.getUserFromToken(token);
            this.loggedInUser = user;
            return user;
        }
    }

    private static getUserFromToken(token: string): User {
        const decoded = AuthService.decodeJwtToken(token)
        return new User(decoded.username);
    }

    private static decodeJwtToken(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
}
