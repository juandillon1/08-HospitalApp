import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import Swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  EsModal: boolean;

  // tslint:disable-next-line: max-line-length
  constructor( public http: HttpClient, public router: Router, public subirarchivo: SubirArchivoService ) {
    this.cargarStorage();
   }
  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    // localStorage.setItem('modal', this.EsModal.toString());
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  renuevaToken() {
    const url = URL_SERVICIO + '/login/renuevatoken?token=' + this.token;
    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => {
                        this.token = resp.token;
                        localStorage.setItem('token', this.token);
                        return true;
                      }),
                      catchError( err => {
                        this.router.navigate(['/login']);
                        Swal('No se pudo verificar login', 'Vuelva a loguarse', 'error');
                        return throwError(err);
                      })
                    );
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }
  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
      // this.EsModal = localStorage.getItem('modal').toLowerCase() === 'true' ? true : false;
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
      // this.EsModal = null;
    }
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIO + '/login/google';
    return this.http.post( url, {token} )
                    .pipe(
                      map( (resp: any) => {
                        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
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
                        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                        return true;
                      }),
                      /*catchError( err => {
                        Swal('Error en el login', err.error.mensaje, 'error');
                        return throwError(err.error.mensaje);
                      })*/
                    );
  }

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIO + '/usuario';
    return this.http.post( url, usuario )
          .pipe(
            map( (resp: any) => {
              Swal('Usuario creado', 'Usuario: ' + usuario.email, 'success');
              return resp.usuario;
            }),
            catchError( err => {
              Swal(err.error.mensaje, err.error.errors.message, 'error');
              return throwError(err.error.mensaje);
            })
          );
  }
  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIO + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
                    .pipe(
                      map( (resp: any) => {
                        if ( usuario._id === this.usuario._id ) {
                          const usuarioDB: Usuario = resp.usuario;
                          this.guardarStorage( usuarioDB._id, this.token, usuarioDB, resp.menu );
                        }

                        Swal('Usuario Actualizado', usuario.nombre, 'success');
                        return true;
                      }),
                      catchError( err => {
                        Swal(err.error.mensaje, err.error.errors.message, 'error');
                        return throwError(err.error.mensaje);
                      })
                    );
  }
  cambiarImagen( file: File, id: string, modal: boolean ) {
    this.EsModal = modal;
    this.subirarchivo.subirArchivo( file, 'usuarios', id )
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      // tslint:disable-next-line: no-unused-expression
      Swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage( id,  this.token, this.usuario, resp.menu);
    })
    .catch( resp => {
      console.log(resp);
    });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIO + '/usuario?desde=' + desde;
    return this.http.get( url );
  }
  buscarUsuario( termino: string ) {
    const url = URL_SERVICIO + '/busqueda/coleccion/usuario/' + termino;
    return this.http.get( url )
            .pipe(
              map( (resp: any) => resp.usuario
              )
            );
  }
  borrarUsuario( id: string ) {
    const url = URL_SERVICIO + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        return true;
                      })
                    );
  }

}
