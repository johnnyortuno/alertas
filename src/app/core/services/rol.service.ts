import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<Rol[]>(environment.serverUrl + '/roles');
  }

  getRol(id: string) {
    return this.http.get<Rol>(environment.serverUrl + '/roles/' + id);
  }

  newRol(rol: Rol) {
    return this.http.post(environment.serverUrl + '/roles/new', rol);
  }

  updateRol(rol: Rol) {
    return this.http.put(environment.serverUrl + '/roles/update', rol);
  }
}
