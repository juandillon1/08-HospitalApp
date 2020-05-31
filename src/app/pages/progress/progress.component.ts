import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {
  progreso1: number = 20;
  progreso2: number = 30;
  constructor() { }

  ngOnInit(): void {
  }
  // actualizar( event ) {
  //   console.log(event);
  //   this.progreso1 = event;
  // }

}
