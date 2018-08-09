import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';


@Injectable()
export class CategoryService {
    constructor(private http: HttpClient) {
    }

    public getCategories(userid: number): Observable<Category[]> {
        return this.http
            .get<Category[]>(`${environment.apiUrl}/user/${userid}/categories`);
    }

    public getCategory(userid: number, id: number): Observable<Category> {
        return this.http
            .get<Category>(`${environment.apiUrl}/user/${userid}/categories/${id}`);
    }

    public createCategory(userid: number, category: Category): Observable<Category> {
        return this.http
            .post<Category>(`${environment.apiUrl}/user/${userid}/categories`, category);
    }

    public updateCategory(userid: number, category: Category): Observable<Category> {
        return this.http
            .patch<Category>(`${environment.apiUrl}/user/${userid}/categories`, category);
    }
}
