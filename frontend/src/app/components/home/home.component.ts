import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { first, flatMap, map, exhaustMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ExpenseDailyReport, ExpenseMonthlyReport } from '../../models/expense.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Chart, ChartData } from 'chart.js';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public dailyReportData: ExpenseDailyReport;
    public monthlyReportData: ExpenseMonthlyReport;
    public categoryMap: Map<number, Category>;

    @ViewChild('monthlyChart')
    private monthlyChartElement: ElementRef;
    private monthlyChart: Chart;

    constructor(
        private authService: AuthService,
        private categoryService: CategoryService,
        private expenseService: ExpenseService
    ) { }

    ngOnInit() {
        Chart.defaults.global.defaultFontFamily = 'Roboto,"Helvetica Neue",sans-serif';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontColor = 'black';

        this.authService.getLoggedInUser()
            .pipe(
                first(),
                exhaustMap(user =>
                    forkJoin(
                        this.expenseService.getDailyExpenseReport(user.id).pipe(first()),
                        this.expenseService.getMonthlyExpenseReport(user.id).pipe(first()),
                        this.categoryService.getCategories(user.id).pipe(first())
                    )
                )
            )
            .subscribe(
                data => {
                    this.dailyReportData = data[0];
                    this.monthlyReportData = data[1];
                    this.showMonthlyChart();
                    this.categoryMap = data[2].reduce((_map, cat) => {
                        _map.set(cat.id, cat);
                        return _map;
                    }, new Map<number, Category>());
                },
                error => console.error(error)
            );
    }

    showMonthlyChart() {
        const chartCtx = this.monthlyChartElement.nativeElement.getContext('2d');

        const data: ChartData = {
            labels: this.monthlyReportData.last5Months.map(x => new Date(0, x.month - 1).toLocaleString(undefined, { month: 'long' })),
            datasets: [{
                'data': this.monthlyReportData.last5Months.map(x => x.value),
            }]
        };

        this.monthlyChart = new Chart(
            chartCtx,
            {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    layout: {
                        padding: 16
                    }
                }
            }
        );
    }
}
