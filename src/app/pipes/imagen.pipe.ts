import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIO } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo?: string): any {
    if ( tipo === '' ) {
      tipo = 'usuario';
    }
    let url = URL_SERVICIO + '/img';
    if ( !img ) {
      return url += '/usuarios/xxx';
    }
    // https significa q es de google
    if ( img.indexOf('https') > -1 ) {
      return img;
    } else {
      switch (tipo) {
        case 'usuario':
          url += '/usuarios/' + img;
          break;
        case 'medico':
          url += '/medicos/' + img;
          break;
        case 'hospital':
          url += '/hospitales/' + img;
          break;
        default:
          // console.log('Tipo imagen no existe, tipo: ' + tipo);
          url += '/usuarios/xxx';
          break;
      }
      return url;
    }
  }
}
