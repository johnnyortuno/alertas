import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { Notificacion } from '../core/models/notificacion.model';
import { EmpresaService } from '../core/services/empresa.service';
import { NivelService } from '../core/services/nivel.service';
import { NotificacionService } from '../core/services/notificacion.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-notificacion-detalle-ver',
  templateUrl: './notificacion-detalle-ver.component.html',
  styleUrls: ['./notificacion-detalle-ver.component.css']
})
export class NotificacionDetalleVerComponent implements OnInit {

  notificacion_id: any = null;
  _notificacion: Notificacion;
  _notificacionLoaded: Promise<boolean>;
  _empresas: Empresa[];
  empresas_por_notificacion: Empresa[];
  selectedEmpresas: number[];
  _nivel: string;

  form: FormGroup;
  formCreated: Promise<boolean>;

  paramsSub: Subscription = Subscription.EMPTY;
  notificacionSub: Subscription = Subscription.EMPTY;
  empresasSub: Subscription = Subscription.EMPTY;
  empresasNotificacionSub: Subscription = Subscription.EMPTY;
  nivelSub: Subscription = Subscription.EMPTY;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private nService: NotificacionService, private storageService: StorageService, private eService: EmpresaService, private niService: NivelService) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.notificacion_id = params.get('id');
      this.getNotificacion(this.notificacion_id).then(() => {
        this.getEmpresas().then(() => {
          this.getEmpresasByNotificacion(this.notificacion_id).then(() => {
            this.getNivelById(this._notificacion.nivel_id).then(() => {
              this.cargarForm();
            });
          });
        });
      });
    });
  }

  getNotificacion(id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.notificacionSub = this.nService.getNotificacion(id).subscribe(data => {
        this._notificacion = data[0];
        resolve();
        this._notificacionLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }

  getEmpresas() {
    var promise = new Promise<void>((resolve, reject) => {
      this.empresasSub = this.eService.getEmpresasByUserId(this.storageService.getCurrentUser().id.toString()).subscribe(data => {
        this._empresas = data;
        resolve();
      });
    });
    return promise;
  }
  
  getEmpresasByNotificacion(notificacion_id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.empresasNotificacionSub = this.eService.getEmpresasByNotificacionId(notificacion_id).subscribe(data => {
        this.empresas_por_notificacion = data;
        this.selectedEmpresas = [];
        this.empresas_por_notificacion.forEach(el => {
          let selected = this._empresas.find(emp => emp.id === el.id);
          if (selected != undefined) {
            this.selectedEmpresas.push(selected.id);
          }
        });
        resolve();
      });
    });
    return promise;
  }

  getNivelById(nivel_id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.nivelSub = this.niService.getNivel(nivel_id).subscribe(data => {
        this._nivel = data.name;
        resolve();
      });
    });
    return promise;
  }

  cargarForm() {
    this.form = this.fb.group({
      mensaje: [this._notificacion.mensaje],
      nivel: [this._nivel],
      empresas: [''],
      usuario: [this._notificacion.user_name + " " + this._notificacion.user_surname],
      activo: [this._notificacion.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  ngOnDestroy() {
    if (this.paramsSub != Subscription.EMPTY) {this.paramsSub.unsubscribe()};
    if (this.notificacionSub != Subscription.EMPTY) {this.notificacionSub.unsubscribe()};
    if (this.nivelSub != Subscription.EMPTY) {this.nivelSub.unsubscribe()};
    if (this.empresasSub != Subscription.EMPTY) {this.empresasSub.unsubscribe()};
    if (this.empresasNotificacionSub != Subscription.EMPTY) {this.empresasNotificacionSub.unsubscribe()};
  }

}
