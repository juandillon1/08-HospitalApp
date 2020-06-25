import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert';

import {MatDialog} from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

export interface ImagenData {
  imagen: File;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemporal: any;

  constructor( public us: UsuarioService, public dialog: MatDialog ) {
    this.usuario = us.usuario;
  }

  ngOnInit(): void {
  }
  guardar( usuario: Usuario ) {
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this.us.actualizarUsuario(this.usuario).subscribe();
  }

  seleccionImagen( archivo ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    // Acá se distingue que es una imagen
    if ( archivo.type.indexOf('image') < 0 ) {
      this.imagenSubir = null;
      Swal('Sólo Imagenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemporal = reader.result;
  }
  cambiarImagen() {
    // Se hace todo por el servicio de usuario
    this.us.cambiarImagen( this.imagenSubir, this.usuario._id, false );
  }

  // Subir archivos por Modal
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '1000px',
      data: this.imagenSubir
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.imagenSubir = result;
    });
  }

}
