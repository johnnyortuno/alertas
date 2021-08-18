import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Nivel } from '../models/nivel.model';

@Injectable({
  providedIn: 'root'
})
export class NivelService {

  constructor(private http: HttpClient) { }

  getNiveles() {
    return this.http.get<Nivel[]>(environment.serverUrl + '/niveles');
  }

  getNivel(id: string) {
    return this.http.get<Nivel>(environment.serverUrl + '/niveles/' + id);
  }

  newNivel(nivel: Nivel) {
    return this.http.post(environment.serverUrl + '/niveles/new', nivel);
  }

  updateNivel(nivel: Nivel) {
    return this.http.put(environment.serverUrl + '/niveles/update', nivel);
  }
}
