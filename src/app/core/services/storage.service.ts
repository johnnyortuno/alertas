import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from '../models/empresa.model';
import { Permiso } from '../models/permiso.model';
import { Session } from '../models/session.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private localStorageService;
  private currentSession : Session = null;

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }

  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  getCurrentPermisos(): Permiso[] {
    var session = this.getCurrentSession();
    return (session && session.permisos) ? session.permisos : null;
  };

  getCurrentEmpresas(): Empresa[] {
    var session = this.getCurrentSession();
    return (session && session.empresas) ? session.empresas : null;
  };

  logout(): void {
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
}
