import { Component, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent {
dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 products: any[] = [];
displayedColumns: string[] = [
    'index',
    'product_name',
    'category',
    'images',
    'description',
    'product_mrp_price',
    'product_discount',
    'product_price',
    'delivery_date'
  ];
  constructor(public apiService: ApiService,) {}

  ngOnInit(): void {
    this.apiService.getProductListDetailsData().subscribe(data => {
      this.dataSource.data = data;
    });
  }
 ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
