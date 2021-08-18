import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Permiso } from '../core/models/permiso.model';
import { PermisoService } from '../core/services/permiso.service';

@Component({
  selector: 'app-permiso-lista',
  templateUrl: './permiso-lista.component.html',
  styleUrls: ['./permiso-lista.component.css']
})
export class PermisoListaComponent implements OnInit {

  _permisos: Permiso[];
  permisosSub: Subscription = Subscription.EMPTY;

  constructor(private pService: PermisoService) { }

  ngOnInit(): void {
    this.getPermisos();
  }

  getPermisos() {
    this.permisosSub = this.pService.getPermisos().subscribe(data => {
      this._permisos = data;
    });
  }

  ngOnDestroy() {
    if (this.permisosSub != Subscription.EMPTY) {this.permisosSub.unsubscribe()};
  }

}
