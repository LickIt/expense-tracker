import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Expense, ExpenseCategoryReport, ExpenseDailyReport, ExpenseMonthlyReport} from '../models/expense.model';
import {map} from 'rxjs/operators';


@Injectable()
export class ExpenseService {
    constructor(private http: HttpClient) {
    }

    private static toLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    public getExpenses(from?: Date, to?: Date): Observable<Expense[]> {
        let params = new HttpParams();
        if (from) {
            params = params.set('from', ExpenseService.toLocalDate(from));
        }
        if (to) {
            params = params.set('to', ExpenseService.toLocalDate(to));
        }

        return this.http.get<{ ['expenses']: Expense[] }>(`${environment.apiUrl}/expenses`, {params})
            .pipe(map(e => e.expenses));
    }

    public createExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(`${environment.apiUrl}/expenses`, expense);
    }

    public getExpenseByCategoryReport(from?: Date, to?: Date): Observable<ExpenseCategoryReport[]> {
        let params = new HttpParams();
        if (from) {
            params = params.set('from', ExpenseService.toLocalDate(from));
        }
        if (to) {
            params = params.set('to', ExpenseService.toLocalDate(to));
        }

        return this.http.get<{ ['categories']: ExpenseCategoryReport[] }>(`${environment.apiUrl}/expenses/category-report`, {params})
            .pipe(map(e => e.categories));
    }

    public getDailyExpenseReport() {
        return this.http.get<ExpenseDailyReport>(`${environment.apiUrl}/expenses/daily-report`);
    }

    public getMonthlyExpenseReport() {
        return this.http.get<ExpenseMonthlyReport>(`${environment.apiUrl}/expenses/monthly-report`);
    }
}
