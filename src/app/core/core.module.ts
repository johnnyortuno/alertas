import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { AuthorizatedGuard } from './guards/authorizated.guard';
import { PermisosGuard } from './guards/permisos.guard';
import { Permisos } from './guards/permisos';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    Permisos,
    StorageService,
    AuthorizatedGuard,
    PermisosGuard
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
