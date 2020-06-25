import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  EsModal: boolean;

  // tslint:disable-next-line: max-line-length
  constructor( public http: HttpClient, public router: Router, public subirarchivo: SubirArchivoService ) {
    this.cargarStorage();
   }
  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('modal', this.EsModal.toString());
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
      this.EsModal = localStorage.getItem('modal').toLowerCase() === 'true' ? true : false;
    } else {
      this.token = '';
      this.usuario = null;
      this.EsModal = null;
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
                        this.guardarStorage(resp.id, resp.token, resp.usuario);
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
                        this.guardarStorage(resp.id, resp.token, resp.usuario);
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
  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIO + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
                    .pipe(
                      map( (resp: any) => {
                        const usuarioDB: Usuario = resp.usuario;
                        this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                        Swal('Usuario Actualizado', usuario.nombre, 'success');
                        return true;
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
      this.guardarStorage( id,  this.token, this.usuario);
    })
    .catch( resp => {
      console.log(resp);
    });
  }

}
