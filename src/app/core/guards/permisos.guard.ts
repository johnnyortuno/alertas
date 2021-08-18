import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PermisoService } from '../services/permiso.service';
import { StorageService } from "../services/storage.service";
import { Permisos } from './permisos';

@Injectable()
export class PermisosGuard implements CanActivateChild {
    
    permisosSub: Subscription = Subscription.EMPTY;

    constructor(private router: Router, private storageService: StorageService, private pService: PermisoService, private mapPermisos: Permisos) { }
    
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let canAccess = false;
        var promise = new Promise<boolean>((resolve, reject) => {
            let url = childRoute.url.length >= 2 ? '/' + childRoute.url[0].path + '/' + childRoute.url[1].path : '/' + childRoute.url[0].path;
            this.canAccessByRol(url).then(canAccess => {
                resolve(canAccess);
            }, error => {
                resolve(canAccess);
            });
        });
        return promise;
    }

    canAccessByRol(url: string): Promise<boolean> {
        let canAccess = false;
        var promise = new Promise<boolean>((resolve, reject) => {
            this.permisosSub = this.pService.getPermisosByRol(this.storageService.getCurrentUser().rol_id).subscribe(
                permisos => {
                    canAccess = this.mapPermisos.checkUrlHasPermisos(url, permisos);
                    resolve(canAccess);
                }
            );
        });
        return promise;
    }
}