import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../env';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';


@Injectable()
export class CategoryService {
    constructor(private http: HttpClient) {
    }

    public getCategories(userid: number): Observable<Category[]> {
        return this.http
            .get<Category[]>(`${API_URL}/categories/user/${userid}`);
    }
}
