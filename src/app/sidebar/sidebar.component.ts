import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Permisos } from '../core/guards/permisos';
import { MenuItem } from '../core/models/menuitem.model';
import { Permiso } from '../core/models/permiso.model';
import { PermisoService } from '../core/services/permiso.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  _urlActual: string;
  _menu: MenuItem[];
  _menuLoaded: Promise<boolean>;
  permisos: Permiso[];
  permisosSub: Subscription = Subscription.EMPTY;

  constructor(private route: Router, private storageService: StorageService, private pService: PermisoService, private mapPermisos: Permisos) {
    this.cargarMenu();
  }

  ngOnInit(): void {
    this._urlActual = this.route.url;
    this.getPermisosByRol().then(() => {
      for (let i=0; i < this._menu.length; i++) {
        let item = this._menu[i];
        if (item.children != null) {
          for (let j=0; j < item.children.length; j++) {
            let subItem = item.children[j];
            this.canAccessByRol(subItem.link).then(canAccess => {
              this._menu[i].children[j].active = canAccess;
              if (canAccess) {
                this._menu[i].active = canAccess;
              }
            });
          }
        }
      }
      this._menuLoaded = Promise.resolve(true);
    });
  }

  canAccessByRol(url: string): Promise<boolean> {
    let canAccess = false;
    var promise = new Promise<boolean>((resolve, reject) => {
      canAccess = this.mapPermisos.checkUrlHasPermisos(url, this.permisos);
      resolve(canAccess);
    });
    return promise;
  }

  getPermisosByRol() {
    var promise = new Promise<void>((resolve, reject) => {
      this.permisos = this.storageService.getCurrentPermisos();
      resolve();
    });
    return promise;
  }

  cargarMenu() {
    this._menu = [
      {
        name: "Usuarios",
        link: "/usuarios",
        active: false,
        children: [
          {
            name: "Lista",
            link: "/usuarios",
            active: false
          },
          {
            name: "Nuevo",
            link: "/usuarios/nuevo",
            active: false
          }
        ]
      },
      {
        name: "Roles",
        link: "/roles",
        active: false,
        children: [
          {
            name: "Lista",
            link: "/roles",
            active: false
          }/*,
          {
            name: "Nuevo",
            link: "/roles/nuevo",
            active: false
          }*/
        ]
      },
      {
        name: "Empresa",
        link: "/empresas",
        active: false,
        children: [
          {
            name: "Lista",
            link: "/empresas",
            active: false
          },
          {
            name: "Nuevo",
            link: "/empresas/nuevo",
            active: false
          }
        ]
      },
      {
        name: "Alertas",
        link: "/notificaciones",
        active: false,
        children: [
          {
            name: "Lista",
            link: "/notificaciones",
            active: false
          },
          {
            name: "Nuevo",
            link: "/notificaciones/nuevo",
            active: false
          },
          {
            name: "Resumen",
            link: "/notificaciones/resumen",
            active: false
          }
        ]
      },
      {
        name: "Niveles",
        link: "/niveles",
        active: false,
        children: [
          {
            name: "Lista",
            link: "/niveles",
            active: false
          },
          {
            name: "Nuevo",
            link: "/niveles/nuevo",
            active: false
          }
        ]
      },
      {
        name: "Ejecuciones",
        link: "/ejecuciones",
        active: true,
        children: [
          {
            name: "Lista",
            link: "/ejecuciones",
            active: false
          },
          {
            name: "Lista",
            link: "/ejecuciones/nuevo",
            active: false
          },
          {
            name: "Resumen",
            link: "/alertas",
            active: false
          }
        ]
      }

    ];
  }

}
