import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient) { }

  getAllNotificaciones() {
    return this.http.get<Notificacion[]>(environment.serverUrl + '/notificaciones');
  }

  getNotificacionesByCreador(creador_id) {
    return this.http.get<Notificacion[]>(environment.serverUrl + '/notificaciones/creados/' + creador_id);
  }

  getNotificacionesByEmpresas(empresas: Empresa[]) {
    let empresas_id: number[] = [];
    empresas.forEach(empresa => {
      empresas_id.push(empresa.id);
    });
    let body = {
      empresas_id: JSON.stringify(empresas_id),
    }
    return this.http.post<Notificacion[]>(environment.serverUrl + '/notificaciones/empresa', body);
  }

  getNotificacion(id: string) {
    return this.http.get<Notificacion>(environment.serverUrl + '/notificaciones/' + id);
  }

  newNotificacion(notificacion: Notificacion) {
    return this.http.post(environment.serverUrl + '/notificaciones/new', notificacion);
  }

  updateNotificacion(notificacion: Notificacion) {
    
    return this.http.put(environment.serverUrl + '/notificaciones/update', notificacion);
  }
}
