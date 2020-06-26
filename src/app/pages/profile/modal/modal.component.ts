import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ImagenData } from '../profile.component';
import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: []
})
export class ModalComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemporal: any;

  constructor( public us: UsuarioService,
               public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ImagenData ) {
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
    this.us.cambiarImagen( this.imagenSubir, this.usuario._id, true );
    if ( this.us.EsModal ) {
      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
