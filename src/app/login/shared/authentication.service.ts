import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginObject } from './login-object.model';
import { Session } from 'src/app/core/models/session.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //private basePath = '/api/authenticate/';
  private basePath = 'http://localhost';

  constructor(private http: HttpClient) { }

  login(loginObj: LoginObject): Observable<Session> {
    return this.http.post<Session>(this.basePath + 'login', loginObj);
  }
  
  getUsers() {
    return this.http.get(environment.serverUrl + '/user');
  }

  logout(): Observable<Boolean> {
    return this.http.post<Boolean>(this.basePath + 'logout', {});
  }
}
