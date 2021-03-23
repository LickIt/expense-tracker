import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Category} from '../models/category.model';


@Injectable()
export class CategoryService {
    constructor(private http: HttpClient) {
    }

    public getCategories(): Observable<Category[]> {
        return this.http.get<{ ['categories']: Category[] }>(`${environment.apiUrl}/categories`).pipe(map(res => res.categories));
    }

    public getCategory(id: number): Observable<Category> {
        return this.http.get<Category>(`${environment.apiUrl}/categories/${id}`);
    }

    public createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${environment.apiUrl}/categories`, category);
    }

    public updateCategory(category: Category): Observable<Category> {
        return this.http.patch<Category>(`${environment.apiUrl}/categories/${category.id}`, category);
    }

    public deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/categories/${id}`);
    }
}
