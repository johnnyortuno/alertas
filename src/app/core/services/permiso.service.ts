import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permiso } from '../models/permiso.model';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  constructor(private http: HttpClient) { }

  getPermisos() {
    return this.http.get<Permiso[]>(environment.serverUrl + '/permisos');
  }

  getPermisosByRol(rol_id) {
    return this.http.get<Permiso[]>(environment.serverUrl + '/permisos/rol/' + rol_id);
  }

  getPermiso(id: string) {
    return this.http.get<Permiso>(environment.serverUrl + '/permisos/' + id);
  }
}
