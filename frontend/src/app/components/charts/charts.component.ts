import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
    @ViewChild('chart')
    private chart: ElementRef;

    ngOnInit() {
        const chartCtx = this.chart.nativeElement.getContext('2d');

        const data = {
            labels: [
                'Value A',
                'Value B'
            ],
            datasets: [
                {
                    'data': [101342, 55342],   // Example data
                    'backgroundColor': [
                        '#1fc8f8',
                        '#76a346'
                    ]
                }]
        };

        const chart = new Chart(
            chartCtx,
            {
                'type': 'pie',
                'data': data,
                'options': {
                    'cutoutPercentage': 0
                }
            }
        );
    }
}
