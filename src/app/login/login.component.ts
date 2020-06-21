import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/Usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // así se aplica el style a cada componente individual
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame: boolean = false;
  auth2: any;
  constructor( public router: Router,
               public usuarioService: UsuarioService ) { }
  ngOnInit(): void {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        clienteid: '579270730799-iodr87bhm1prh8h42ct4ncuhkk6t2jn3.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignIn( document.getElementById('btnGoogle') );
    });
  }
  attachSignIn( element ) {
    this.auth2.attachClickHandler( element, {}, googleUser => {
      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;
      this.usuarioService.loginGoogle( token )
                          .subscribe(() => window.location.href = '#/dashboard');
    });
  }
  ingresar( f: NgForm ) {
    if ( f.invalid ) {
      return;
    }
    const usuario = new Usuario(null, f.value.email, f.value.pass);
    this.usuarioService.login( usuario, f.value.recordarme )
                       .subscribe( log => this.router.navigate(['/dashboard']));
  }

}
