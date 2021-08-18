import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginObject } from './login-object.model';
import { Session } from 'src/app/core/models/session.model';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(loginObj: LoginObject): Observable<any> {
    return this.http.post<any>(environment.serverUrl + '/login', loginObj);
  }
  /*login(loginObj: LoginObject): Observable<Session> {
    return this.http.post<Session>(environment.serverUrl + '/login', loginObj);
  }*/

  logout(): Observable<Boolean> {
    return this.http.post<Boolean>(environment.serverUrl + '/logout', {});
  }
}
