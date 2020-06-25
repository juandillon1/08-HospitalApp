import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/Usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor( public us: UsuarioService ) { }
  usuario: Usuario;

  ngOnInit(): void {
    this.usuario = this.us.usuario;
  }

}
