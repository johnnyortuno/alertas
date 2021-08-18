import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Periocidad } from '../models/periocidad.model';


@Injectable({
    providedIn: 'root'
  })

  export class PeriocidadService {

    constructor(private http: HttpClient) { }
  
    getPeriocidades() {
      return this.http.get<Periocidad[]>(environment.serverUrl + '/periocidad');
    }
  
    getPeriocidad(id: string) {
      return this.http.get<Periocidad>(environment.serverUrl + '/periocidad/' + id);
    }
  
    newPeriocidad(grupo: Periocidad) {
      return this.http.post(environment.serverUrl + '/periocidad/new', grupo);
    }
  
    updatePeriocidad(grupo: Periocidad) {
      return this.http.put(environment.serverUrl + '/periocidad/update', grupo);
    }
  }
  