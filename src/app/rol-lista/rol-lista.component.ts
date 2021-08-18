import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Rol } from '../core/models/rol.model';
import { RolService } from '../core/services/rol.service';

@Component({
  selector: 'app-rol-lista',
  templateUrl: './rol-lista.component.html',
  styleUrls: ['./rol-lista.component.css']
})
export class RolListaComponent implements OnInit {

  _roles: Rol[];
  rolesSub: Subscription = Subscription.EMPTY;

  constructor(private rService: RolService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.rolesSub = this.rService.getRoles().subscribe(data => {
      this._roles = data;
    });
  }

  ngOnDestroy() {
    if (this.rolesSub != Subscription.EMPTY) {this.rolesSub.unsubscribe()};
  }

}
