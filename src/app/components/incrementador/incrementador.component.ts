import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  //Hace referencia a un elemento html especifico
  @ViewChild('txtProgreso') txtProgreso: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input('progress') progreso: number = 50;


  @Output('cambiaValor') cambioValor: EventEmitter<number> = new EventEmitter();



  constructor() {
    // console.log('Leyenda', this.leyenda);
    // console.log('Progreso', this.progreso);
   }

  ngOnInit(): void {
    // console.log('Leyenda', this.leyenda);
    // console.log('Progreso', this.progreso);
  }
  onChanged( nuevoValor: number ) {
    console.log(nuevoValor);
    if ( nuevoValor >= 100 ) {
      this.progreso = 100;
    } else if ( nuevoValor <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }
    // asigna el valor para que no se pueda exceder el numero
    this.txtProgreso.nativeElement.value = this.progreso;

    this.cambioValor.emit( this.progreso );
    this.txtProgreso.nativeElement.focus();
  }

  cambiarPorc( valor: number ) {
    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      Swal.fire({
        icon: 'error',
        title: 'Porcentaje Excedido',
        text: 'Excediste el porcentaje permitido!'
      });
      return;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      Swal.fire({
        icon: 'error',
        title: 'Porcentaje menor a 1',
        text: 'El porcentaje debe ser mayor a 1!'
      });
      return;
    }
    this.progreso = this.progreso + valor;
    // Emite el evento hacia el progress
    this.cambioValor.emit( this.progreso );
  }

}
