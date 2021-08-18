import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Nivel } from '../core/models/nivel.model';
import { NivelService } from '../core/services/nivel.service';

@Component({
  selector: 'app-nivel-detalle',
  templateUrl: './nivel-detalle.component.html',
  styleUrls: ['./nivel-detalle.component.css']
})
export class NivelDetalleComponent implements OnInit {

  nivel_id: any = null;
  _nivel: Nivel;
  _nivelLoaded: Promise<boolean>;
  _new: boolean;
  nivelSub: Subscription = Subscription.EMPTY;
  paramsSub: Subscription = Subscription.EMPTY;
  newNivelSub: Subscription = Subscription.EMPTY;

  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private route: ActivatedRoute, private nivelService: NivelService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.nivel_id = params.get('id');
      if (this.nivel_id != null) {
        this._new = false;
        this.getNivel(this.nivel_id).then(() => {
          this.cargarForm();
        });
      } else {
        this._new = true;
        this.crearForm();
        this._nivelLoaded = Promise.resolve(true);
      }
    });
  }

  getNivel(id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.nivelSub = this.nivelService.getNivel(id).subscribe(data => {
        this._nivel = data[0];
        resolve();
        this._nivelLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      color: ['', Validators.required],
      activo: [true]
    });
    this.formCreated = Promise.resolve(true);
  }

  cargarForm() {
    this.form = this.fb.group({
      id: [this._nivel.id, Validators.required],
      name: [this._nivel.name, Validators.required],
      color: [this._nivel.color, Validators.required],
      activo: [this._nivel.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  get name() { return this.form.get('name'); }
  get color() { return this.form.get('color'); }

  onSubmit() {
    let new_nivel: Nivel;
    if (this._new) {
      if (this.form.valid) {
        new_nivel = {
          id: 0,
          name: this.form.value.name,
          color: this.form.value.color,
          activo: this.form.value.activo
        };
        this._invalid = false;
    
        this.newNivelSub = this.nivelService.newNivel(new_nivel).subscribe(
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
        new_nivel = {
          id: this._nivel.id != null ? this._nivel.id : this.form.value.id,
          name: this.form.value.name,
          color: this.form.value.color,
          activo: this.form.value.activo
        };
        this._invalid = false;
    
        this.newNivelSub = this.nivelService.updateNivel(new_nivel).subscribe(
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
    if (this.nivelSub != Subscription.EMPTY) {this.nivelSub.unsubscribe()};
    if (this.newNivelSub != Subscription.EMPTY) {this.newNivelSub.unsubscribe()};
  }

}
