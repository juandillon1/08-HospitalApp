import { Injectable } from '@angular/core';
import { Hospital } from 'src/app/models/Hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  token = localStorage.getItem('token');
  usuariol = localStorage.getItem('usuario');
  constructor( private http: HttpClient ) { }
  cargarHospitales( desde: number ) {
    const url = URL_SERVICIO + '/hospital' + '?desde=' + desde;
    return this.http.get( url );
  }
  obtenerHospital( id: string ) {
    const url = URL_SERVICIO + '/hospital/' + id;
    return this.http.get( url )
                    .pipe(
                      map(  (resp: any) => resp.hospital )
                    );
  }
  borrarHospital( id: string ) {
    const url = URL_SERVICIO + '/hospital/' + id + '?token=' + this.token;
    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        return true;
                      })
                    );
  }

  crearHospital( nombreh: string ) {
    const url = URL_SERVICIO + '/hospital' + '?token=' + this.token;
    const hospital = {
      nombre: nombreh,
      usuario: JSON.parse(this.usuariol)
    };
    return this.http.post( url, hospital )
          .pipe(
            map( (resp: any) => {
              console.log(resp);
              Swal('Hospital creado', 'Hospital: ' + resp.hospital.nombre, 'success');
              return resp.hospitales;
            })
          );
  }
  buscarHospital( termino: string ) {
    const url = URL_SERVICIO + '/busqueda/coleccion/hospital/' + termino;
    return this.http.get( url )
            .pipe(
              map( (resp: any) => resp.hospital
              )
            );
  }
  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIO + '/hospital/' + hospital._id;
    url += '?token=' + this.token;
    return this.http.put(url, hospital)
                    .pipe(
                      map( (resp: any) => {
                        Swal('Hospital Actualizado', hospital.nombre, 'success');
                        return true;
                      })
                    );
  }
}
