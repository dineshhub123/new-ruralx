import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sell-notification',
  templateUrl: './sell-notification.component.html',
  styleUrls: ['./sell-notification.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SellNotificationComponent implements OnInit {
  public sellItemData!: MatTableDataSource<any>;  
  public buyerUsername: any;


   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public apiService: ApiService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.buyProduct()
    this.loadData();
  }
  ngAfterViewInit(): void {
    this.sellItemData.paginator = this.paginator;
    this.sellItemData.sort = this.sort;
  }


  buyProduct() {
  this.apiService.getUserBuyerDetails().subscribe((response: any) => {
    this.sellItemData = new MatTableDataSource(response); 
    this.sellItemData.paginator = this.paginator;         
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.sellItemData.filter = filterValue.trim().toLowerCase();
}
 loadData(): void {
    this.apiService.getUserBuyerDetails().subscribe((data: any) => {
      this.sellItemData.data = data;
      console.log(data ,'data');
    });

  }
}
