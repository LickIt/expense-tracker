import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../env';
import { User } from './user.model';


@Injectable()
export class UsersApiService {
    constructor(private http: HttpClient) {
    }

    getUsers(): Observable<User[]> {
        return this.http
            .get<User[]>(`${API_URL}/users`);
    }
}
