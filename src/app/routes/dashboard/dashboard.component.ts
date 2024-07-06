import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { SettingsService } from '@core';
import { Subscription } from 'rxjs';

import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = this.dashboardSrv.getData();

  messages = this.dashboardSrv.getMessages();
  charts = this.dashboardSrv.getCharts();
  chart3: any;
  chart4: any;
  chart5: any;
  stats = this.dashboardSrv.getStats();
  notifySubscription!: Subscription;

  startDate!: Date;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.notifySubscription = this.settings.notify.subscribe(res => {
      console.log(res);
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.chart3) this.chart3?.destroy();
    if (this.chart4) this.chart4?.destroy();
    if (this.chart5) this.chart5?.destroy();

    this.notifySubscription.unsubscribe();
  }

  initChart() {
    this.chart3 = new ApexCharts(document.querySelector('#chart3'), {
      series: [
        {
          name: 'Bubble1',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: 'Bubble2',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: 'Bubble3',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: 'Bubble4',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
      ],
      chart: {
        height: 350,
        type: 'bubble',
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 0.8,
      },
      title: {
        text: 'Simple Bubble Chart',
      },
      xaxis: {
        tickAmount: 12,
        type: 'category',
      },
      yaxis: {
        max: 70,
      },
    });
    this.chart3?.render();
    this.chart4 = new ApexCharts(document.querySelector('#chart4'), {
      series: [
        {
          name: 'PRODUCT A',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['01/2011', '02/2011', '03/2011', '04/2011', '05/2011', '06/2011'],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    });
    this.chart4?.render();
    this.chart5 = new ApexCharts(document.querySelector('#chart5'), {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    });
    this.chart5?.render();
  }

  generateData(baseval: any, count: any, yrange: any) {
    const series = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
      series.push([x, y, z]);
      baseval += 86400000;
    }
    return series;
  }

  onDateChange(event: any) {
    this.startDate = event.value;
  }

  updateData() {
    if (this.startDate) {
      const dateInstance = new Date(this.startDate);
      if (isNaN(dateInstance.getTime())) {
        console.error('Invalid date:', this.startDate);
        return;
      }

      this.dashboardSrv.getDataByDate(dateInstance).subscribe((data: any) => {
        this.stats = data.stats;
        this.charts = data.charts;
        this.dataSource = data.dataSource;
        this.messages = data.messages;

        this.initChart();
      });
    }
  }
}
