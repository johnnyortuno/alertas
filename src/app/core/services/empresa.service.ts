import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  getEmpresas() {
    return this.http.get<Empresa[]>(environment.serverUrl + '/empresas');
  }

  getEmpresa(id: string) {
    return this.http.get<Empresa>(environment.serverUrl + '/empresas/' + id);
  }

  newEmpresa(empresa: Empresa) {
    return this.http.post(environment.serverUrl + '/empresas/new', empresa);
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(environment.serverUrl + '/empresas/update', empresa);
  }

  getEmpresasByUserId(user_id: string) {
    return this.http.get<Empresa[]>(environment.serverUrl + '/users/' + user_id + '/empresas');
  }

  updateEmpresasByUserId(user_id: string, empresas_id: string[]) {
    let body = {
      user_id: user_id,
      empresas: empresas_id
    };
    return this.http.post<Empresa[]>(environment.serverUrl + '/users/' + user_id + '/empresas/update', body);
  }

  getEmpresasByNotificacionId(notificacion_id: string) {
    return this.http.get<Empresa[]>(environment.serverUrl + '/notificaciones/' + notificacion_id + '/empresas');
  }
}
