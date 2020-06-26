import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemporal: any;
  // tslint:disable-next-line: variable-name
  constructor( public _subirarchivo: SubirArchivoService, public _modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
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
  subirImagen() {
    this._subirarchivo.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
        .then( resp => {
           this._modalUploadService.notificacion.emit( resp );
           this.cerrarModal();
        })
        .catch( e => {
          console.log('Error en la carga...');
        });
  }
  cerrarModal() {
    this.imagenTemporal = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
  }

}
