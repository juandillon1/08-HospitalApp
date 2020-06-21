import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient, public router: Router ) {
    this.cargarStorage();
   }
  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }
  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIO + '/login/google';
    return this.http.post( url, {token} )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage(resp.id, resp.token, resp.id);
                        return true;
                      })
                    );
  }

  login( usuario: Usuario, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIO + '/login';
    return this.http.post( url, usuario )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage(resp.id, resp.token, resp.id);
                        return true;
                      })
                    );
  }

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIO + '/usuario';
    return this.http.post( url, usuario )
          .pipe(
            map( (resp: any) => {
              Swal('Usuario creado', 'Usuario: ' + usuario.email, 'success');
              return resp.usuario;
            })
          );
  }

}
