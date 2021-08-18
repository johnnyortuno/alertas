import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { RolListaComponent } from './rol-lista/rol-lista.component';
import { RolDetalleComponent } from './rol-detalle/rol-detalle.component';
import { PermisoListaComponent } from './permiso-lista/permiso-lista.component';
import { PermisoDetalleComponent } from './permiso-detalle/permiso-detalle.component';
import { RolPermisoDetalleComponent } from './rol-permiso-detalle/rol-permiso-detalle.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { EmpresaDetalleComponent } from './empresa-detalle/empresa-detalle.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { NotificacionListaComponent } from './notificacion-lista/notificacion-lista.component';
import { NotificacionDetalleComponent } from './notificacion-detalle/notificacion-detalle.component';
import { NivelListaComponent } from './nivel-lista/nivel-lista.component';
import { NivelDetalleComponent } from './nivel-detalle/nivel-detalle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EncryptDecryptService } from './core/services/encrypt-decrypt.service';
import { UsuarioEmpresaDetalleComponent } from './usuario-empresa-detalle/usuario-empresa-detalle.component';
import { EmpresaUsuarioDetalleComponent } from './empresa-usuario-detalle/empresa-usuario-detalle.component';
import { CoreModule } from './core/core.module';
import { NotificacionDetalleVerComponent } from './notificacion-detalle-ver/notificacion-detalle-ver.component';
import { NotificacionResumenComponent } from './notificacion-resumen/notificacion-resumen.component';
import { EjecucionListaComponent } from './ejecucion-lista/ejecucion-lista.component';
import { EjecucionDetalleComponent } from './ejecucion-detalle/ejecucion-detalle.component';
import { AlertaListaComponent } from './alerta-lista/alerta-lista.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuarioDetalleComponent,
    UsuarioListaComponent,
    RolListaComponent,
    RolDetalleComponent,
    PermisoListaComponent,
    PermisoDetalleComponent,
    RolPermisoDetalleComponent,
    SidebarComponent,
    NavbarComponent,
    MainComponent,
    EmpresaDetalleComponent,
    EmpresaListaComponent,
    NotificacionListaComponent,
    NotificacionDetalleComponent,
    NivelListaComponent,
    NivelDetalleComponent,
    UsuarioEmpresaDetalleComponent,
    EmpresaUsuarioDetalleComponent,
    NotificacionDetalleVerComponent,
    NotificacionResumenComponent,
    EjecucionListaComponent,
    EjecucionDetalleComponent,
    AlertaListaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [EncryptDecryptService],
  bootstrap: [AppComponent]
})
export class AppModule { }
