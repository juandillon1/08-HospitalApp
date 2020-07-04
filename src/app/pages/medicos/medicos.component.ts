import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: any[] = [];

  constructor( public ms: MedicoService ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }
  cargarMedicos() {
    this.ms.cargarMedicos()
           .subscribe( medicos => this.medicos = medicos);
  }
  borrarMedico( medico: Medico ) {
    this.ms.borrarMedico( medico._id ).subscribe( resp => this.cargarMedicos() );
  }
  buscarMedico( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }
    this.ms.buscarMedicos( termino )
           .subscribe( medicos => this.medicos = medicos );
  }

}
