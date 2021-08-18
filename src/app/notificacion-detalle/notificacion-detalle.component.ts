import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { Familia } from '../core/models/familia_alerta.model';
import { Grupo } from '../core/models/grupo_principal.model';
import { Nivel } from '../core/models/nivel.model';
import { Notificacion } from '../core/models/notificacion.model';
import { Periocidad } from '../core/models/periocidad.model';
import { EmpresaService } from '../core/services/empresa.service';
import { FamiliaService } from '../core/services/familia.service';
import { GrupoService } from '../core/services/grupo.service';
import { NivelService } from '../core/services/nivel.service';
import { NotificacionService } from '../core/services/notificacion.service';
import { PeriocidadService } from '../core/services/periocidad.service';
import { StorageService } from '../core/services/storage.service';



@Component({
  selector: 'app-notificacion-detalle',
  templateUrl: './notificacion-detalle.component.html',
  styleUrls: ['./notificacion-detalle.component.css']
})
export class NotificacionDetalleComponent implements OnInit {
  

  notificacion_id: any = null;
  _notificacion: Notificacion;
  _notificacionLoaded: Promise<boolean>;
  _new: boolean;
  _niveles: Nivel[];
  selectedNiveles: number[];
  _empresas: Empresa[] = [];
  empresas_por_notificacion: Empresa[];
  selectedEmpresas: number[];
  //jose rivera
  _grupos: Grupo[];
  _familias: Familia[];
  _periocidades: Periocidad[];

  paramsSub: Subscription = Subscription.EMPTY;
  notificacionSub: Subscription = Subscription.EMPTY;
  newNotificacionSub: Subscription = Subscription.EMPTY;
  nivelSub: Subscription = Subscription.EMPTY;
  grupoSub: Subscription = Subscription.EMPTY;
  familiaSub: Subscription = Subscription.EMPTY;
  periocidadSub: Subscription = Subscription.EMPTY;
  empresasSub: Subscription = Subscription.EMPTY;
  empresasNotificacionSub: Subscription = Subscription.EMPTY;

  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private route: ActivatedRoute, private nService: NotificacionService, private eService: EmpresaService, private niService: NivelService, private fb: FormBuilder, private storageService: StorageService,private grService: GrupoService,private fmService: FamiliaService,private perService:PeriocidadService) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.notificacion_id = params.get('id');
      this.getNiveles();
      this.getGrupos();
      this.getPeriocidades();
      if (this.notificacion_id != null) {
        this._new = false;
        this.getNotificacion(this.notificacion_id).then(() => {
          this.getEmpresas().then(() => {
            this.getEmpresasByNotificacion(this.notificacion_id).then(() => {
              this.cargarForm();
            });
          });
        });
      } else {
        this._new = true;
        this.getEmpresas().then(() => {
          this.crearForm();
        });
        this._notificacionLoaded = Promise.resolve(true);
      }
    });
  }

  getEmpresas() {
    var promise = new Promise<void>((resolve, reject) => {
      let rol_id = this.storageService.getCurrentUser().rol_id;
      if (rol_id == '1') {
        this.empresasSub = this.eService.getEmpresas().subscribe(data => {
          this._empresas = data;
          resolve();
        });
      } else if (rol_id == '2') {
        this.empresasSub = this.eService.getEmpresasByUserId(this.storageService.getCurrentUser().id.toString()).subscribe(data => {
          this._empresas = data;
          resolve();
        });
      }
    });
    return promise;
  }

  getEmpresasByNotificacion(notificacion_id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.empresasNotificacionSub = this.eService.getEmpresasByNotificacionId(notificacion_id).subscribe(data => {
        this.empresas_por_notificacion = data;
        this.selectedEmpresas = [];
        this.empresas_por_notificacion.forEach(el => {
          this.selectedEmpresas.push(this._empresas.find(emp => emp.id === el.id).id);
        });
        resolve();
      });
    });
    return promise;
  }

  getNiveles() {
    var promise = new Promise<void>((resolve, reject) => {
      this.nivelSub = this.niService.getNiveles().subscribe(data => {
        this._niveles = data;
        resolve();
      });
    });
    return promise;
  }

  getGrupos() {
    var promise = new Promise<void>((resolve, reject) => {
      this.grupoSub = this.grService.getGrupos().subscribe(data => {
        this._grupos = data;
        resolve();
      });
    });
    return promise;
  }
  getPeriocidades() {
    var promise = new Promise<void>((resolve, reject) => {
      this.periocidadSub = this.perService.getPeriocidades().subscribe(data => {
        this._periocidades = data;
        resolve();
      });
    });
    return promise;
  }

  getFamilia(idGrupo:number) {
    var promise = new Promise<void>((resolve, reject) => {
      this.familiaSub = this.fmService.getFamiliasByGrupo(idGrupo).subscribe(data => {
        this._familias = data;
        resolve();
      });
    });
    return promise;
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

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      mensaje: ['', Validators.required],
      periocidad: ['', Validators.required],
      grupo: ['', Validators.required],
      familia: ['', Validators.required],
      nivel: ['', Validators.required],
      dp: ['', Validators.required],
      empresas: [''],
      usuario: ['Gabriel Chávez'],
      usuarioId: [this.storageService.getCurrentUser().id],
      activo: [true]
    });
    this.formCreated = Promise.resolve(true);
  }

  cargarForm() {
    this.form = this.fb.group({
      id: [this._notificacion.id],
      mensaje: [this._notificacion.mensaje, Validators.required],
      periocidad: [this._notificacion.id_periodo, Validators.required],
      grupo: [this._notificacion.id_grupo, Validators.required],
      familia: [this._notificacion.id_familia, Validators.required],
      nivel: [this._notificacion.nivel_id, Validators.required],
      dp: [this._notificacion.fecha_creacion, Validators.required],
      empresas: [''],
      usuario: [this._notificacion.user_name + " " + this._notificacion.user_surname],
      usuarioId: [this._notificacion.creador_id],
      activo: [this._notificacion.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  get mensaje() { return this.form.get('mensaje'); }

  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`; 

  onSubmit() {
    //console.log(this.form.valid);
    //console.log(this.form.value);
    let new_notificacion: Notificacion;
    if (this._new) {
      if (this.form.valid) {
        new_notificacion = {
          id: 0,
          mensaje: this.form.value.mensaje,
          nivel_id: this.form.value.nivel,
          empresas: this.form.value.empresas,
          creador_id: this.form.value.usuarioId,
          activo: this.form.value.activo,
          id_familia:this.form.value.familia,
          id_grupo:this.form.value.grupo,
          id_periodo:this.form.value.periocidad,
          fecha_ejecucion:this.dateToString(this.form.value.dp)
        };
        this._invalid = false;
    
        this.newNotificacionSub = this.nService.newNotificacion(new_notificacion).subscribe(
          data => {
            this._success = true;
            this._error = false;
            this.form.reset();
          },
          error => {
            this._success = false;
            this._error = true;
          }
        );
      } else {
        this._invalid = true;
      }

    } else {
      
      if (this.form.valid) {
        new_notificacion = {
          id: this._notificacion.id != null ? this._notificacion.id : this.form.value.id,
          mensaje: this.form.value.mensaje,
          nivel_id: this.form.value.nivel,
          empresas: this.form.value.empresas,
          creador_id: this.form.value.usuarioId,
          activo: this.form.value.activo,
          id_familia:this.form.value.familia,
          id_grupo:this.form.value.grupo,
          id_periodo:this.form.value.periocidad,
          fecha_ejecucion:this.dateToString(this.form.value.dp)
        };
        this._invalid = false;
    
        this.newNotificacionSub = this.nService.updateNotificacion(new_notificacion).subscribe(
          data => {
            this._success = true;
            this._error = false;
          },
          error => {
            this._success = false;
            this._error = true;
          }
        );
          
      } else {
        this._invalid = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.paramsSub != Subscription.EMPTY) {this.paramsSub.unsubscribe()};
    if (this.notificacionSub != Subscription.EMPTY) {this.notificacionSub.unsubscribe()};
    if (this.newNotificacionSub != Subscription.EMPTY) {this.newNotificacionSub.unsubscribe()};
    if (this.nivelSub != Subscription.EMPTY) {this.nivelSub.unsubscribe()};
    if (this.empresasSub != Subscription.EMPTY) {this.empresasSub.unsubscribe()};
    if (this.empresasNotificacionSub != Subscription.EMPTY) {this.empresasNotificacionSub.unsubscribe()};
  }
  changeGrupoSelectedItem(filterVal: any) {
    console.log(filterVal);
    this.getFamilia(filterVal);
  }
}
