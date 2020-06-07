import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  // Sirve para hacer referencia al suscription del observable
  suscripcion: Subscription;

  constructor() {
    this.suscripcion = this.regresaOBS()
    // .pipe(
    //   retry(2)
    //  )
    .subscribe( numero => {
      console.log('Subs: ', numero);
    },
    error => console.log('Error en OBS: ', error),
    () => console.log('El observador terminó'));
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
  regresaOBS(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      let interval = setInterval( () => {
        contador += 1;
        const salida = {
          valor: contador
        };
        // NEXT sirve para decir cual es el valor del observable
        observer.next( salida );
        // if( contador === 3 ) {
        //   clearInterval( interval );
        //   // sirve el complete para decir que ya no se tiene q escuchar al observable
        //   observer.complete();
        // }
        // if ( contador ===  2) {
        //   clearInterval( interval );
        //   observer.error('Auxilio!!!');
        // }

      }, 1000 );
    } ).pipe(
      map( resp => resp.valor ),
      // recibe una funcion
      filter( ( valor, index ) => {
        if ( (valor % 2 ) === 1 ) {
          // impar
          return true;
        } else {
          //par
          return false;
        }
      } )
    );
  }

}
