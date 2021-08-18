import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(environment.serverUrl + '/users');
  }

  getUser(id: string) {
    return this.http.get<User>(environment.serverUrl + '/users/' + id);
  }

  newUser(user: User) {
    return this.http.post(environment.serverUrl + '/users/new', user);
  }

  updateUser(user: User) {
    return this.http.put(environment.serverUrl + '/users/update', user);
  }

  /*getUsersByEmpresaId(empresa_id: string) {
    return this.http.get<User[]>(environment.serverUrl + '/empresas/' + empresa_id + '/users');
  }*/

  updateUsersByEmpresaId(empresa_id: string, usuarios_id: string[]) {
    let body = {
      empresa_id: empresa_id,
      usuarios: usuarios_id
    };
    return this.http.post<User[]>(environment.serverUrl + '/empresas/' + empresa_id + '/users/update', body);
  }

  getUsersByEmpresas(empresas: Empresa[]) {
    let empresas_id: number[] = [];
    empresas.forEach(empresa => {
      empresas_id.push(empresa.id);
    });
    let body = {
      empresas_id: JSON.stringify(empresas_id),
    }
    return this.http.post<User[]>(environment.serverUrl + '/empresas/users', body);
  }
}
