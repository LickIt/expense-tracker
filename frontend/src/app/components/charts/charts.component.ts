import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { first, flatMap, map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { Category } from '../../models/category.model';
import { ExpenseCategoryReport } from '../../models/expense.model';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
    @ViewChild('chart')
    private chartElement: ElementRef;
    private reportData: ExpenseCategoryReport[];
    private chart: Chart;
    public fromDate: Date;
    public toDate: Date;

    constructor(
        private authService: AuthService,
        private expenseService: ExpenseService,
        private categoryService: CategoryService,
    ) { }

    ngOnInit() {
        Chart.defaults.global.defaultFontFamily = 'Roboto,"Helvetica Neue",sans-serif';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontColor = 'black';

        // default range is start of month to now
        const now = new Date();
        this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        this.load();
    }

    load() {
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
                flatMap(_ => this.expenseService.getExpenseByCategoryReport(userid, this.fromDate, this.toDate)),
                first(),
                map(expenses => {
                    for (const expense of expenses) {
                        (<any>expense).category = categoriesMap.get(expense.categoryid);
                    }

                    return expenses;
                })
            )
            .subscribe(expenses => {
                this.reportData = expenses.sort((a, b) => b.amount - a.amount);
                this.loadChart();
            });
    }

    loadChart() {
        const chartCtx = this.chartElement.nativeElement.getContext('2d');

        const data: ChartData = {
            labels: this.reportData.map((r: any) => r.category.name),
            datasets: [{
                'data': this.reportData.map(r => r.amount),
                'backgroundColor': this.reportData.map((r: any) => r.category.color),
            }]
        };

        this.chart = new Chart(
            chartCtx,
            {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    cutoutPercentage: 40,
                    legend: {
                        position: 'left'
                    }
                }
            }
        );

        this.chart.data = data;
        this.chart.render();
    }

    fromDateChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.value;
        this.load();
    }

    toDateChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.value;
        this.load();
    }
}
