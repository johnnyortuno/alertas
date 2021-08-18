import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Rol } from '../core/models/rol.model';
import { RolService } from '../core/services/rol.service';

@Component({
  selector: 'app-rol-detalle',
  templateUrl: './rol-detalle.component.html',
  styleUrls: ['./rol-detalle.component.css']
})
export class RolDetalleComponent implements OnInit {

  rol_id: any = null;
  _rol: Rol;
  _rolLoaded: Promise<boolean>;
  _new: boolean;
  rolSub: Subscription = Subscription.EMPTY;
  paramsSub: Subscription = Subscription.EMPTY;
  newRolSub: Subscription = Subscription.EMPTY;

  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private route: ActivatedRoute, private rolService: RolService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.rol_id = params.get('id');
      if (this.rol_id != null) {
        this._new = false;
        this.getRol(this.rol_id).then(() => {
          this.cargarForm();
        });
      } else {
        this._new = true;
        this.crearForm();
        this._rolLoaded = Promise.resolve(true);
      }
    });
  }

  getRol(id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.rolSub = this.rolService.getRol(id).subscribe(data => {
        this._rol = data[0];
        resolve();
        this._rolLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      activo: [true]
    });
    this.formCreated = Promise.resolve(true);
  }

  cargarForm() {
    this.form = this.fb.group({
      id: [this._rol.id, Validators.required],
      name: [this._rol.name, Validators.required],
      activo: [this._rol.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  get name() { return this.form.get('name'); }

  onSubmit() {
    let new_rol: Rol;
    if (this._new) {
      if (this.form.valid) {
        new_rol = {
          id: 0,
          name: this.form.value.name,
          activo: this.form.value.activo
        };
        this._invalid = false;
    
        this.newRolSub = this.rolService.newRol(new_rol).subscribe(
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
        new_rol = {
          id: this._rol.id != null ? this._rol.id : this.form.value.id,
          name: this.form.value.name,
          activo: this.form.value.activo
        };
        this._invalid = false;
    
        this.newRolSub = this.rolService.updateRol(new_rol).subscribe(
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
    if (this.rolSub != Subscription.EMPTY) {this.rolSub.unsubscribe()};
    if (this.newRolSub != Subscription.EMPTY) {this.newRolSub.unsubscribe()};
  }
}
