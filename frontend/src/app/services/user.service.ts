import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    public getUsers(): Observable<User[]> {
        return this.http
            .get<User[]>(`${environment.apiUrl}/users`);
    }
}
