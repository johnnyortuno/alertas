import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Familia } from '../models/familia_alerta.model';

@Injectable({
    providedIn: 'root'
  })

  export class FamiliaService {

    constructor(private http: HttpClient) { }
  
    getFamilias() {
      return this.http.get<Familia[]>(environment.serverUrl + '/familias');
    }

    getFamiliasByGrupo(idGrupo:number) {
        return this.http.get<Familia[]>(environment.serverUrl + '/familias/grupo/'+ idGrupo);
      }
  
    get(id: string) {
      return this.http.get<Familia>(environment.serverUrl + '/familias/' + id);
    }
  
    newGrupo(familia: Familia) {
      return this.http.post(environment.serverUrl + '/familias/new', familia);
    }
  
    updateGrupo(familia: Familia) {
      return this.http.put(environment.serverUrl + '/familias/update', familia);
    }
  }
  