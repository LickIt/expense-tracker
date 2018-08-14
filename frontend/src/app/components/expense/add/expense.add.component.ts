import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { first, flatMap, tap } from 'rxjs/operators';
import { Category } from '../../../models/category.model';
import { Expense } from '../../../models/expense.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-expense-add',
    templateUrl: './expense.add.component.html',
    styleUrls: ['./expense.add.component.css']
})
export class ExpenseAddComponent implements OnInit {
    public categories: Category[];
    public saving = false;
    public error: any;

    public expenseForm = this.fb.group({
        amount: [null, Validators.required],
        timestamp: [new Date(), Validators.required],
        categoryid: [null, Validators.required],
        notes: ['']
    });

    constructor(
        private authService: AuthService,
        private expenseService: ExpenseService,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.getLoggedInUser()
            .pipe(
                first(),
                flatMap(user => this.categoryService.getCategories(user.id)),
                first()
            )
            .subscribe(
                categories => this.categories = categories,
                error => this.error = error
            );
    }

    onSubmit() {
        this.saving = true;
        const expense: Expense = Object.assign(new Expense(), this.expenseForm.value);
        this.authService.getLoggedInUser()
            .pipe(
                first(),
                flatMap(user => {
                    return this.expenseService.createExpense(user.id, expense);
                }),
                first()
            )
            .subscribe(
                _expense => this.router.navigate(['/expense']),
                error => {
                    this.error = error;
                    this.saving = false;
                }
            );
    }
}
