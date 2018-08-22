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
import { LinearFitter } from '../../common/fitters';

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

    @ViewChild('dailyChart')
    private dailyChartElement: ElementRef;
    private dailyChart: Chart;

    constructor(
        private authService: AuthService,
        private categoryService: CategoryService,
        private expenseService: ExpenseService
    ) { }

    ngOnInit() {
        Chart.defaults.global.defaultFontFamily = 'Roboto,"Helvetica Neue",sans-serif';
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontColor = 'rgba(0,0,0,.87)';

        const userid = this.authService.getLoggedInUserId();
        forkJoin(
            this.expenseService.getDailyExpenseReport(userid).pipe(first()),
            this.expenseService.getMonthlyExpenseReport(userid).pipe(first()),
            this.categoryService.getCategories(userid).pipe(first())
        ).subscribe(
            data => {
                this.dailyReportData = data[0];
                this.monthlyReportData = data[1];
                this.showMonthlyTrendChart();
                this.categoryMap = data[2].reduce((_map, cat) => {
                    _map.set(cat.id, cat);
                    return _map;
                }, new Map<number, Category>());
                this.showDailyCategoriesChart();
            },
            error => console.error(error)
        );
    }

    showDailyCategoriesChart() {
        const chartCtx = this.dailyChartElement.nativeElement.getContext('2d');

        const data: ChartData = {
            labels: this.dailyReportData.topCategories.map(x => this.categoryMap.get(x.categoryid).name),
            datasets: [{
                data: this.dailyReportData.topCategories.map(x => x.value),
                backgroundColor: this.dailyReportData.topCategories.map(x => this.categoryMap.get(x.categoryid).color)
            }]
        };

        this.dailyChart = new Chart(
            chartCtx,
            {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    }
                }
            }
        );
    }

    showMonthlyTrendChart() {
        const chartCtx = this.monthlyChartElement.nativeElement.getContext('2d');

        // trend calculation
        const fitter = new LinearFitter();
        this.monthlyReportData.monthlyTrend.forEach((m, idx) => fitter.add(idx, m.value));
        const trendData = fitter.project(...Array.from(Array(fitter.count).keys()));
        const trendPositive = trendData[trendData.length - 1] <= trendData[0];

        const data: ChartData = {
            labels: this.monthlyReportData.monthlyTrend.map(x => new Date(0, x.month - 1).toLocaleString(undefined, { month: 'long' })),
            datasets: [
                {
                    data: this.monthlyReportData.monthlyTrend.map(x => x.value),
                    fill: false,
                    borderColor: 'rgb(54, 162, 235)'
                },
                {
                    data: trendData,
                    fill: false,
                    borderColor: trendPositive ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
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
                    }
                }
            }
        );
    }
}
