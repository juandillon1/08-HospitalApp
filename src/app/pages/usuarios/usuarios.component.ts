import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert';
import {MatDialog} from '@angular/material/dialog';
import { ModalComponent } from '../profile/modal/modal.component';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

export interface ImagenData {
  imagen: File;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  imagenSubir: File;

  // tslint:disable-next-line: variable-name
  constructor( public us: UsuarioService, public dialog: MatDialog, public _modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }
  cargarUsuarios() {
    this.cargando = true;

    this.us.cargarUsuarios( this.desde )
          .subscribe( (resp: any) => {
            this.totalRegistros = resp.total;
            this.usuarios = resp.usuarios;
            setTimeout(() => {
              this.cargando = false;
            }, 500);
          });
  }
  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }
  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this.us.buscarUsuario( termino )
            .subscribe( (usuarios: any) => {
              this.usuarios = usuarios;
              this.cargando = false;
            });
  }
  borrarUsuario( usuario: Usuario ) {
    this.desde = 0;
    if ( usuario._id === this.us.usuario._id ) {
      Swal('No puede borrar este Usuario', 'No podés borrar tu propio usuario :D', 'error');
      return;
    }
    Swal({
      title: '¿Está seguro de borrar a ' + usuario.nombre + '?',
      text: 'Una vez borrado no se podrá recuperar',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    })
    .then((borrar) => {
      if ( borrar ) {
        this.us.borrarUsuario(usuario._id)
               .subscribe( borrado => {
                Swal('Usuario Borrado', 'Usuario ' + usuario.nombre + ' eliminado con éxito', 'success');
                this.cargarUsuarios();
               });
      }

    });
  }
  guardarUsuario( usuario: Usuario ) {
    this.us.actualizarUsuario( usuario )
           .subscribe();
  }
  mostrarmodal( id: string ) {
    this._modalUploadService.mostrarModal( 'usuarios', id );

  }

}
