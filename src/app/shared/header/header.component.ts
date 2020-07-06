import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/Usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor( public us: UsuarioService, public router: Router ) { }
  usuario: Usuario;

  ngOnInit(): void {
    this.usuario = this.us.usuario;
  }
  buscar( termino: string ) {
    this.router.navigate(['/busqueda', termino]);
  }

}
