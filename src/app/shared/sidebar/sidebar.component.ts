import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/Usuario.model';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  constructor( public sidebar: SidebarService, public us: UsuarioService ) { }

  ngOnInit(): void {
    this.usuario = this.us.usuario;
  }

}
