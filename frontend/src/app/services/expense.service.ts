import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expense, ExpenseCategoryReport } from '../models/expense.model';
import { AuthService } from './auth.service';


@Injectable()
export class ExpenseService {
    constructor(private http: HttpClient, private authService: AuthService) {
    }

    public getExpenses(userid: number, from?: Date, to?: Date): Observable<Expense[]> {
        let params = new HttpParams();
        if (from) {
            params = params.set('from', this.dateToUnixTimestamp(from).toString());
        }
        if (to) {
            params = params.set('to', this.dateToUnixTimestamp(to).toString());
        }

        return this.http.get<Expense[]>(`${environment.apiUrl}/user/${userid}/expenses`, { params });
    }

    public createExpense(userid: number, expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(`${environment.apiUrl}/user/${userid}/expenses`, expense);
    }

    public getExpenseByCategoryReport(userid: number, from?: Date, to?: Date): Observable<ExpenseCategoryReport[]> {
        let params = new HttpParams();
        if (from) {
            params = params.set('from', this.dateToUnixTimestamp(from).toString());
        }
        if (to) {
            params = params.set('to', this.dateToUnixTimestamp(to).toString());
        }

        return this.http.get<ExpenseCategoryReport[]>(`${environment.apiUrl}/user/${userid}/expenses/category-report`, { params });
    }

    private dateToUnixTimestamp(date: Date): number {
        return Math.floor(date.getTime() / 1000);
    }
}
