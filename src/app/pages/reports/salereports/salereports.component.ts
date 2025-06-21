import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-salereports',
  templateUrl: './salereports.component.html',
  styleUrls: ['./salereports.component.css']
})
export class SalereportsComponent {
  barChartOption: EChartsOption = {};
  pieChartOption: EChartsOption = {};
  velocityChartOption: EChartsOption = {};
  ngOnInit() {
 this.barChartOption ={
    title: {
      text: 'Sales Report'
    },
    tooltip: {},
    xAxis: {
      data: ['Shirts', 'Shoes', 'Jeans', 'Hats']
    },
    yAxis: {},
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [15, 22, 30, 10]
      }
    ]
  };

  }

}
