import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent {

  constructor(public router:Router){}

ngOnInit() {
  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 5000);
}
}

