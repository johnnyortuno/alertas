import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { EmpresaService } from '../core/services/empresa.service';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.css']
})
export class EmpresaDetalleComponent implements OnInit {

  empresa_id: any = null;
  _empresa: Empresa;
  _empresaLoaded: Promise<boolean>;
  _new: boolean;
  empresaSub: Subscription = Subscription.EMPTY;
  paramsSub: Subscription = Subscription.EMPTY;
  newEmpresaSub: Subscription = Subscription.EMPTY;

  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private route: ActivatedRoute, private empresaService: EmpresaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.empresa_id = params.get('id');
      if (this.empresa_id != null) {
        this._new = false;
        this.getEmpresa(this.empresa_id).then(() => {
          this.cargarForm();
        });
      } else {
        this._new = true;
        this.crearForm();
        this._empresaLoaded = Promise.resolve(true);
      }
    });
  }

  getEmpresa(id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.empresaSub = this.empresaService.getEmpresa(id).subscribe(data => {
        this._empresa = data[0];
        resolve();
        this._empresaLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      numero_identificacion: ['', Validators.required],
      activo: [true]
    });
    this.formCreated = Promise.resolve(true);
  }

  cargarForm() {
    this.form = this.fb.group({
      id: [this._empresa.id, Validators.required],
      name: [this._empresa.name, Validators.required],
      numero_identificacion: [this._empresa.numero_identificacion, Validators.required],
      activo: [this._empresa.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  get name() { return this.form.get('name'); }

  onSubmit() {
    let new_empresa: Empresa;
    if (this._new) {
      if (this.form.valid) {
        new_empresa = {
          id: 0,
          name: this.form.value.name,
          activo: this.form.value.activo,
          numero_identificacion:this.form.value.numero_identificacion,
        };
        this._invalid = false;
    
        this.newEmpresaSub = this.empresaService.newEmpresa(new_empresa).subscribe(
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
        new_empresa = {
          id: this._empresa.id != null ? this._empresa.id : this.form.value.id,
          name: this.form.value.name,
          activo: this.form.value.activo,
          numero_identificacion:this.form.value.numero_identificacion,
        };
        this._invalid = false;
    
        this.newEmpresaSub = this.empresaService.updateEmpresa(new_empresa).subscribe(
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
    if (this.empresaSub != Subscription.EMPTY) {this.empresaSub.unsubscribe()};
    if (this.newEmpresaSub != Subscription.EMPTY) {this.newEmpresaSub.unsubscribe()};
  }
}
