import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/Hospital.model';
import { HospitalService } from '../../services/service.index';
import { Medico } from '../../models/Medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public hs: HospitalService,
              private ms: MedicoService,
              public router: Router,
              public ar: ActivatedRoute,
              public ups: ModalUploadService
              ) {
    ar.params.subscribe( params => {
      const id = params.id;
      if ( id !== 'nuevo' ){
        this.cargarMedico( id );
      }
    });
   }

  ngOnInit(): void {
    this.hs.cargarHospitales(0)
           .subscribe( (hospitales: any) => this.hospitales = hospitales.hospitales );
    this.ups.notificacion
            .subscribe( resp => {
              this.medico.img = resp.medico.img;
            });
  }
  guardarMedico( f: NgForm ) {
    if ( f.invalid ) { return; }
    this.ms.guardarMedico( this.medico )
           .subscribe( medico => {
             this.medico._id = medico._id;
             this.router.navigate(['/medico', medico._id]);
             if ( this.ms.medicoGuardado ) {
              this.router.navigate(['/medicos']);
            }
           });
  }
  cambioHospital( id ) {
    this.hs.obtenerHospital(id)
           .subscribe( hospital => {
              this.hospital = hospital;
           });
  }
  cargarMedico( id: string ) {
    this.ms.cargarMedico( id )
           .subscribe( medico => {
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
            this.cambioHospital( medico.hospital );
          });
  }
  cambiarFoto() {
    this.ups.mostrarModal('medicos', this.medico._id);

  }

}
