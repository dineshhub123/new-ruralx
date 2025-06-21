import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EChartsOption } from 'echarts';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { trigger, transition, animate, style } from '@angular/animations';
import { range } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
  }
  userNoSearchItem(searchData: any) {
    let userChipsData = {
      searchData: searchData
    };
    this.apiService.searchData(userChipsData).subscribe(res => {
      let displayMobileData = res;
      localStorage.setItem('displaySearchData', JSON.stringify(displayMobileData))
      this.router.navigate(['./display-item'])
    })
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
