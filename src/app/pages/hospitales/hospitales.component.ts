// notas
// Para poner clase custom Sweet alert poner : className: 'sweet-crear' en el confirm-catch-etc



import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/Hospital.model';
import Swal from 'sweetalert';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  cargando: boolean = true;
  totalRegistros: number = 0;
  hospitales: Hospital[] = [];
  desde: number = 0;
  // tslint:disable-next-line: variable-name
  constructor( private hs: HospitalService, private _modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => {
      this.cargarHospitales();
    });
  }
  cargarHospitales() {
    this.cargando = true;

    this.hs.cargarHospitales( this.desde )
          .subscribe( (resp: any) => {
            this.totalRegistros = resp.total;
            this.hospitales = resp.hospitales;
            setTimeout(() => {
              this.cargando = false;
            }, 500);
          });
  }
  buscarHospital( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this.hs.buscarHospital( termino )
            .subscribe( (hospitales: any) => {
              this.hospitales = hospitales;
              this.cargando = false;
            });
  }
  guardarHospital( hospital: Hospital ) {
    this.hs.actualizarHospital( hospital )
           .subscribe();
  }
  borrarHospital( hospital: Hospital ) {
    this.desde = 0;
    Swal({
      title: '¿Está seguro de borrar ' + hospital.nombre + '?',
      text: 'Una vez borrado no se podrá recuperar',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    })
    .then((borrar) => {
      if ( borrar ) {
        this.hs.borrarHospital(hospital._id)
               .subscribe( borrado => {
                Swal('Hospital Borrado', hospital.nombre + ' eliminado con éxito', 'success');
                this.cargarHospitales();
               });
      }

    });
  }
  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }
  mostrarmodal( id: string ) {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

  crearHospital() {
    this.swalCrear();
    // El servicio se llama en el swal de confirmación
  }
  // Acá empiezan los swals
  swalCrear() {
    // El any sirve para q no tire error en este caso
    Swal('Ingrese Nombre del Hospital', {
      content: 'input',
      buttons: {
        defeat: {
          text: 'Cancelar',
          value: 'Cancelar',
          className: 'btn-danger'
        },
        confirm: {
          text: 'Crear',
        }
      },
      closeOnClickOutside: false
    } as any)
    .then((value: string) => {
      // alfanumerica  tampoco permite especiales
      const reg = new RegExp( '^[a-zA-Z- -()]*$' );
      if ( value.startsWith('()') || value.startsWith('-') || value.startsWith(')') ) {
        Swal({
          text: 'Introdujo los caracteres () o - al principio',
          title: 'Error',
          icon: 'warning',
          buttons: false
        } as any);
        setTimeout(() => {
          this.swalCrear();
        }, 1500);
        return;
      }
      if ( reg.test(value) === false && value !== '' ) {
        Swal({
          text: 'Sólo se aceptan caracteress y () o -',
          title: 'Error',
          icon: 'warning',
          buttons: false
        } as any);
        setTimeout(() => {
          this.swalCrear();
        }, 1500);
        return;
      }
      if ( value.length < 5 && value !== '' && reg.test(value) === true) {
        Swal({
          text: 'El campo debe tener al menos 4 letras',
          title: 'Error',
          icon: 'warning',
          buttons: false
        } as any);
        setTimeout(() => {
          this.swalCrear();
        }, 1500);
        return;
      }

      switch (value) {
        case '':
          Swal({
            text: 'El campo no puede estar vacío',
            title: 'Error',
            icon: 'warning',
            buttons: false
          } as any);
          setTimeout(() => {
            this.swalCrear();
          }, 1500);
          break;
        case 'Cancelar':
          return;
        case value:
        // Ingresa los datos del hospital y se pide confirmación
        this.swalCrearConfirmacion( value );
        break;
        default:
          return;
      }
    });
  }
  swalCrearConfirmacion( value: string ) {
    Swal(`Ingresó: ${value}, desea crear el hospital?`, {
      buttons: {
        defeat: {
          text: 'Cancelar',
          value: 'Cancelar',
          className: 'btn-danger'
        },
        catch: {
          text: 'Cambiar',
          value: 'Cambiar',
          className: 'btn-info'
        },
        confirm: {
            text: 'Crear',
            value: 'Crear',
            className: 'btn-success'
        }
      },
      closeOnClickOutside: false,
      dangerMode: true
    } as any)
    .then( (confirmacion) => {
      switch (confirmacion) {
        case 'Cambiar':
          this.crearHospital();
          break;
        case 'Crear':
          // LLamar al servicio que crea el hospital acá
          this.hs.crearHospital( value )
                 .subscribe();
          break;
        default:
          return;
      }
    });
  }
  // Acá terminan los swals


}
