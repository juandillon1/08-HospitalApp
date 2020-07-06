import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIO } from '../../config/config';
import { Usuario } from '../../models/Usuario.model';
import { Medico } from '../../models/Medico.model';
import { Hospital } from '../../models/Hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor( public actroute: ActivatedRoute, public http: HttpClient ) {
    actroute.params
            .subscribe( params => {
              const termino = params.termino;
              this.buscar( termino );
            } );
  }

  ngOnInit(): void {
  }
  buscar( termino: string ) {
    const url = URL_SERVICIO + '/busqueda/todo/' + termino;
    this.http.get( url )
             .subscribe( (resp: any) => {
               this.medicos = resp.medicos;
               this.usuarios = resp.usuarios;
               this.hospitales = resp.hospitales;
             });
  }

}
