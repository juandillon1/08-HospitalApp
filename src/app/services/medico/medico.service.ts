import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/Medico.model';
import Swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  totalMedicos: number = 0;
  medicoGuardado: boolean = false;
  constructor( public http: HttpClient, public us: UsuarioService ) { }
  cargarMedicos() {
    const url = URL_SERVICIO + '/medico';
    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => {
                        this.totalMedicos = resp.total;
                        return resp.medicos;
                      })
                    );
  }
  buscarMedicos( termino: string ) {
    const url = URL_SERVICIO + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
            .pipe(
              map( (resp: any) => resp.medicos
              )
            );
  }
  borrarMedico( id: string ) {
    const url = URL_SERVICIO + '/medico/' + id + '?token=' + this.us.token;
    return this.http.delete(url)
                    .pipe(
                      map( resp => {
                        Swal('Médico borrado', 'Médico borrado correctamente', 'success');
                        return resp;
                      } )
                    );
  }
  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIO + '/medico';
    if ( medico._id ) {
      url += '/' + medico._id;
      url += '?token=' + this.us.token;
      return this.http.put( url, medico )
                       .pipe(
                         map( (resp: any) => {
                          this.medicoGuardado = true;
                          Swal('Médico Actualizado', medico.nombre, 'success');
                          return resp.medico;
                         })
                       );
    } else {
      url += '?token=' + this.us.token;
      return this.http.post( url, medico )
               .pipe(
                 map( (resp: any) => {
                   this.medicoGuardado = true;
                   Swal('Médico Creado', medico.nombre, 'success');
                   return resp.medico;
                  })
               );
    }
    this.medicoGuardado = false;
  }
  cargarMedico( id: string ) {
    const url = URL_SERVICIO + '/medico/' + id;
    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.medico)
                    );
  }
}
