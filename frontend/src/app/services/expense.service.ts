import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_URL } from '../env';
import { Expense } from '../models/expense.model';
import { AuthService } from './auth.service';


@Injectable()
export class ExpenseService {
    constructor(private http: HttpClient, private authService: AuthService) {
    }

    public getExpenses(userid: number, from?: Date, to?: Date): Observable<Expense[]> {
        const params = new HttpParams();
        if (from) {
            params.set('from', this.dateToUnixTimestamp(from).toString());
        }
        if (to) {
            params.set('from', this.dateToUnixTimestamp(to).toString());
        }

        return this.http.get<Expense[]>(`${API_URL}/expenses/user/${userid}`, { params });
    }

    public createExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(`${API_URL}/expenses`, expense);
    }

    private dateToUnixTimestamp(date: Date): number {
        return Math.floor(date.getTime() / 1000);
    }
}
