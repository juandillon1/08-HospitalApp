import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/Usuario.model';
import { Router } from '@angular/router';


declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;
  constructor( public usuarioService: UsuarioService,
               public router: Router ) { }


  passIguales(  pass1: string, pass2: string ) {
    return ( group: FormGroup ) => {
      // tslint:disable-next-line: prefer-const
      let password1 = group.controls[pass1].value;
      // tslint:disable-next-line: prefer-const
      let password2 = group.controls[pass2].value;
      if ( password1 === password2 ) {
        return null;
      }
      return {
        sonIguales: true
      };
    };
  }
  ngOnInit(): void {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      pass: new FormControl(null, Validators.required),
      pass2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.passIguales('pass', 'pass2')});
    this.forma.setValue({
      nombre: 'Test',
      email: 'test@test.com',
      pass: '123456',
      pass2: '123456',
      condiciones: true,
    });
  }
  registrarUsuario() {
    if ( this.forma.invalid ) {
      return;
    }
    if ( !this.forma.value.condiciones ) {
      swal('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }
    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.pass
    );

    this.usuarioService.crearUsuario(usuario)
        .subscribe( resp => {this.router.navigate(['/login'])} );
  }

}
