import { EjecucionDetalleComponent } from './ejecucion-detalle/ejecucion-detalle.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizatedGuard } from './core/guards/authorizated.guard';
import { PermisosGuard } from './core/guards/permisos.guard';
import { EjecucionListaComponent } from './ejecucion-lista/ejecucion-lista.component';
import { EmpresaDetalleComponent } from './empresa-detalle/empresa-detalle.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { EmpresaUsuarioDetalleComponent } from './empresa-usuario-detalle/empresa-usuario-detalle.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NivelDetalleComponent } from './nivel-detalle/nivel-detalle.component';
import { NivelListaComponent } from './nivel-lista/nivel-lista.component';
import { NotificacionDetalleVerComponent } from './notificacion-detalle-ver/notificacion-detalle-ver.component';
import { NotificacionDetalleComponent } from './notificacion-detalle/notificacion-detalle.component';
import { NotificacionListaComponent } from './notificacion-lista/notificacion-lista.component';
import { NotificacionResumenComponent } from './notificacion-resumen/notificacion-resumen.component';
import { PermisoDetalleComponent } from './permiso-detalle/permiso-detalle.component';
import { PermisoListaComponent } from './permiso-lista/permiso-lista.component';
import { RolDetalleComponent } from './rol-detalle/rol-detalle.component';
import { RolListaComponent } from './rol-lista/rol-lista.component';
import { RolPermisoDetalleComponent } from './rol-permiso-detalle/rol-permiso-detalle.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { UsuarioEmpresaDetalleComponent } from './usuario-empresa-detalle/usuario-empresa-detalle.component';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { AlertaListaComponent } from './alerta-lista/alerta-lista.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent, canActivate: [ AuthorizatedGuard ], canActivateChild: [ PermisosGuard ], 
    children: [
      { path: 'usuarios', component: UsuarioListaComponent },
      { path: 'usuarios/editar/:id', component: UsuarioDetalleComponent },
      { path: 'usuarios/nuevo', component: UsuarioDetalleComponent },
      { path: 'usuarios/empresas/:id', component: UsuarioEmpresaDetalleComponent },
      //{ path: 'usuarios/:id/reestablecer-contrasena', component: UsuarioDetalleComponent },
      { path: 'roles', component: RolListaComponent },
      { path: 'roles/editar/:id', component: RolDetalleComponent },
      { path: 'roles/nuevo', component: RolDetalleComponent },
      { path: 'roles/permisos/:id', component: RolPermisoDetalleComponent },
      { path: 'permisos', component: PermisoListaComponent },
      { path: 'permisos/editar/:id', component: PermisoDetalleComponent },
      { path: 'permisos/nuevo', component: PermisoDetalleComponent },
      { path: 'empresas', component: EmpresaListaComponent },
      { path: 'empresas/editar/:id', component: EmpresaDetalleComponent },
      { path: 'empresas/nuevo', component: EmpresaDetalleComponent },
      { path: 'empresas/usuarios/:id', component: EmpresaUsuarioDetalleComponent },
      //{ path: 'notificaciones/creados/:creador_id', component: NotificacionListaComponent },
      { path: 'notificaciones', component: NotificacionListaComponent },
      { path: 'notificaciones/editar/:id', component: NotificacionDetalleComponent },
      { path: 'notificaciones/nuevo', component: NotificacionDetalleComponent },
      { path: 'notificaciones/resumen', component: NotificacionResumenComponent },
      { path: 'notificaciones/detalle/:id', component: NotificacionDetalleVerComponent },
      { path: 'niveles', component: NivelListaComponent },
      { path: 'niveles/editar/:id', component: NivelDetalleComponent },
      { path: 'ejecuciones', component: EjecucionListaComponent },
      { path: 'ejecuciones/editar/:id', component: EjecucionDetalleComponent },
      { path: 'alertas', component:AlertaListaComponent}
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
