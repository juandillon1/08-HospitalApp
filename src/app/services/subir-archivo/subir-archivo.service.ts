import { Injectable } from '@angular/core';
import { URL_SERVICIO } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }
  // Se realiza este servicio por javascript puro
  subirArchivo( archivo: File, tipo: string, id: string ) {

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);
      // tslint:disable-next-line: only-arrow-functions
      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 ) {
            console.log('Imagen subida');
            resolve( JSON.parse(xhr.response) );
          } else {
            console.log('Falló la subida');
            reject( JSON.parse(xhr.response) );
          }
        }
      };

      const url = URL_SERVICIO + '/upload/' + tipo + '/' + id;
      xhr.open('PUT', url, true);
      xhr.send( formData );

    });
  }

}
