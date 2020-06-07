import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarTres().then(
      () => console.log('Terminó')
    )
    .catch(
      error => console.error('Error en promesa', error)
    );
  }

   contarTres(): Promise<boolean> {
    return new Promise((resolve, reject) => {
    let contador = 0;
    let intervalo = setInterval( () => {
      contador += 1;
      console.log(contador);
      if ( contador === 3 ) {
        reject(false);
        clearInterval(intervalo);
      }
    }, 1000 );
    });
   }


  ngOnInit(): void {
  }

}
