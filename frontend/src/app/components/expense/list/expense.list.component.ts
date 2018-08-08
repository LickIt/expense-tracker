import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { first, map, flatMap, tap } from 'rxjs/operators';
import { Expense } from '../../../models/expense.model';
import { Category } from '../../../models/category.model';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense.list.component.html',
    styleUrls: ['./expense.list.component.css']
})
export class ExpenseListComponent implements OnInit {
    public displayedColumns: string[] = ['timestamp', 'amount', 'category', 'notes'];
    public fromDate: Date;
    public toDate: Date;
    public dataSource = new MatTableDataSource<Expense>();
    public error: any;
    public isBigScreen = true;
    public dateFormat = 'medium';

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private authService: AuthService,
        private expenseService: ExpenseService,
        private categoryService: CategoryService,
        private breakpointObserver: BreakpointObserver,
        private datePipe: DatePipe
    ) {
        // default range is start of month to now
        const now = new Date();
        this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    ngOnInit() {
        // detect screen size changes
        this.breakpointObserver
            .observe(['(min-width: 440px)'])
            .subscribe((state: BreakpointState) => {
                this.isBigScreen = state.matches;
                this.dateFormat = state.matches ? 'medium' : 'mediumDate';
                if (state.matches) {
                    this.displayedColumns = ['timestamp', 'category', 'notes', 'amount'];
                } else {
                    this.displayedColumns = ['timestamp', 'category', 'amount'];
                }
            });

        // custom sorting for category
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'category': return (<any>item).category.name;
                default: return item[property];
            }
        };
        this.dataSource.sort = this.sort;

        // custom filter for category and date
        this.dataSource.filterPredicate = ((item, filter) => {
            // timestamp
            const date = this.datePipe.transform(item.timestamp, this.dateFormat).toLowerCase();
            if (date.includes(filter)) {
                return true;
            }

            // category
            const category = (<any>item).category.name.toLowerCase();
            if (category.includes(filter)) {
                return true;
            }

            // notes
            if (this.displayedColumns.includes('notes')) {
                const notes = item.notes.toLowerCase();
                if (notes.includes(filter)) {
                    return true;
                }
            }

            // amount
            const amount = item.amount.toFixed(2);
            if (amount.includes(filter)) {
                return true;
            }

            return false;
        });

        // load data
        this.load();
    }

    load() {
        // add 1 day to make the interval inclusive
        const toDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate() + 1);
        let userid: number;
        let categoriesMap: Map<number, Category>;

        // get user
        this.authService.getLoggedInUser()
            .pipe(
                first(),
                // get categories
                flatMap(user => {
                    userid = user.id;
                    return this.categoryService.getCategories(userid);
                }),
                first(),
                // add categories to map
                tap(categories => {
                    categoriesMap = categories.reduce((_map, cat) => {
                        _map.set(cat.id, cat);
                        return _map;
                    }, new Map<number, Category>());
                }),
                // get expenses
                flatMap(_ => this.expenseService.getExpenses(userid, this.fromDate, toDate)),
                first(),
                map(expenses => {
                    for (const expense of expenses) {
                        (<any>expense).category = categoriesMap.get(expense.categoryid);
                    }

                    return expenses;
                })
            )
            .subscribe(expenses => this.dataSource.data = expenses);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getTotalAmount() {
        if (!this.dataSource.filteredData) {
            return 0;
        }

        return this.dataSource.filteredData.map(e => e.amount).reduce((acc, value) => acc + value, 0);
    }
}
