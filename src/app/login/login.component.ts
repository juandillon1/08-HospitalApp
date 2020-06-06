import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // así se aplica el style a cada componente individual
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  constructor( public router: Router ) { }

  ngOnInit(): void {
    init_plugins();
  }

  ingresar() {
    this.router.navigate(['/dashboard']);
  }

}
