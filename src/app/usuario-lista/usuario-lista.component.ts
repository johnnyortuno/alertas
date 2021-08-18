import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../core/models/user.model';
import { StorageService } from '../core/services/storage.service';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {

  _users: User[];
  usersSub: Subscription = Subscription.EMPTY;

  constructor(private uService: UsuarioService, private storageService: StorageService) { }

  ngOnInit(): void {
    let rol_id = this.storageService.getCurrentUser().rol_id;
    if (rol_id == '1') {
      this.usersSub = this.uService.getUsers().subscribe(data => {
        this._users = data;
      });
    } else if (rol_id == '2') {
      let empresas = this.storageService.getCurrentEmpresas();
      this.usersSub = this.uService.getUsersByEmpresas(empresas).subscribe(data => {
        this._users = data;
      });
    }
  }

  ngOnDestroy() {
    if (this.usersSub != Subscription.EMPTY) {this.usersSub.unsubscribe()};
  }

}
