import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {
  imageBaseUrl = environment.imageBaseUrl;

}
