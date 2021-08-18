import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Grupo } from '../models/grupo_principal.model';


@Injectable({
    providedIn: 'root'
  })

  export class GrupoService {

    constructor(private http: HttpClient) { }
  
    getGrupos() {
      return this.http.get<Grupo[]>(environment.serverUrl + '/grupos');
    }
  
    getGrupo(id: string) {
      return this.http.get<Grupo>(environment.serverUrl + '/grupos/' + id);
    }
  
    newGrupo(grupo: Grupo) {
      return this.http.post(environment.serverUrl + '/grupos/new', grupo);
    }
  
    updateGrupo(grupo: Grupo) {
      return this.http.put(environment.serverUrl + '/grupos/update', grupo);
    }
  }
  