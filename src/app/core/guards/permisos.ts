import { Permiso } from "../models/permiso.model";

export class Permisos {
    
    //Map <url, permisos>
    map: Map<string, Array<string>>;

    constructor () {
        this.map = new Map();
        this.map.set("/usuarios", ['ver_usuarios'])
            .set("/usuarios/editar", ['editar_usuarios'])
            .set("/usuarios/nuevo", ['agregar_usuarios'])
            .set("/usuarios/empresas", ['editar_usuarios', 'ver_empresas'])

            .set("/roles", ['ver_roles'])
            .set("/roles/editar", ['editar_roles'])
            .set("/roles/nuevo", ['agregar_roles'])
            .set("/roles/permisos", ['editar_roles', 'editar_permisos'])

            .set("/empresas", ['ver_empresas'])
            .set("/empresas/editar", ['editar_empresas'])
            .set("/empresas/nuevo", ['agregar_empresas'])
            .set("/empresas/usuarios", ['editar_empresas', 'ver_usuarios'])

            .set("/notificaciones", ['ver_notificaciones'])
            .set("/notificaciones/editar", ['editar_notificaciones'])
            .set("/notificaciones/nuevo", ['agregar_notificaciones'])
            .set("/notificaciones/detalle", ['ver_notificaciones'])
            .set("/notificaciones/resumen", ['resumen_alertas'])

            .set("/niveles", ['ver_niveles'])
            .set("/niveles/editar", ['editar_niveles'])
            .set("/niveles/nuevo", ['agregar_niveles'])

            .set("/ejecuciones", ['ver_ejecuciones'])
            .set("/ejecuciones/editar", ['editar_niveles'])
            .set("/alertas", ['ver_alertas'])
            ;
            // .set("/ejecuciones",['ver_ejecuciones'])
            // .set("/ejecuciones/editar", ['editar_niveles'])
            
      
            // .set("/Ejecuciones", component:)
      //{ path: 'permisos', component: PermisoListaComponent },
      //{ path: 'permisos/:id', component: PermisoDetalleComponent },
      //{ path: 'permisos/nuevo', component: PermisoDetalleComponent },
    }

    getPermisos() {
        return this.map;
    }

    checkUrlHasPermisos(url: string, permisos: Permiso[]): boolean {
        let hasPermisos = false;
        let permisosNeeded = this.map.get(url);
        hasPermisos = permisosNeeded.every(p => permisos.findIndex(permiso => permiso.code_name===p) != -1);

        return hasPermisos;
    }
}