import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { Notificacion } from '../core/models/notificacion.model';
import { User } from '../core/models/user.model';
import { NotificacionService } from '../core/services/notificacion.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-notificacion-lista',
  templateUrl: './notificacion-lista.component.html',
  styleUrls: ['./notificacion-lista.component.css']
})
export class NotificacionListaComponent implements OnInit {

  _user: User;
  _notificaciones: Notificacion[];
  rol_id: string;

  notificacionesSub: Subscription = Subscription.EMPTY;

  constructor(private nService: NotificacionService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.rol_id = this.storageService.getCurrentUser().rol_id;
    if (this.rol_id == '1') {
      this.getAllNotificaciones();
    } else if (this.rol_id == '2') {
      this.getNotificacionesByCreador(this.storageService.getCurrentUser().id);
    } else if (this.rol_id == '3') {
      this.getNotificacionesByEmpresas(this.storageService.getCurrentEmpresas());
    }
  }

  getAllNotificaciones() {
    var promise = new Promise<void>((resolve, reject) => {
      this.notificacionesSub = this.nService.getAllNotificaciones().subscribe(data => {
        this._notificaciones = data;
        resolve();
      });
    });
    return promise;
  }

  getNotificacionesByCreador(user_id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.notificacionesSub = this.nService.getNotificacionesByCreador(user_id).subscribe(data => {
        this._notificaciones = data;
        console.log(this._notificaciones);
        resolve();
      });
    });
    return promise;
  }

  getNotificacionesByEmpresas(empresas: Empresa[]) {
    var promise = new Promise<void>((resolve, reject) => {
      this.notificacionesSub = this.nService.getNotificacionesByEmpresas(empresas).subscribe(data => {
        this._notificaciones = data;
        console.log(this._notificaciones);
        resolve();
      });
    });
    return promise;
  }

  ngOnDestroy() {
    if (this.notificacionesSub != Subscription.EMPTY) {this.notificacionesSub.unsubscribe()};
  }

}
