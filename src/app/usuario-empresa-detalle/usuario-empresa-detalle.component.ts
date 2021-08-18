import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { User } from '../core/models/user.model';
import { EmpresaService } from '../core/services/empresa.service';
import { StorageService } from '../core/services/storage.service';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-usuario-empresa-detalle',
  templateUrl: './usuario-empresa-detalle.component.html',
  styleUrls: ['./usuario-empresa-detalle.component.css']
})
export class UsuarioEmpresaDetalleComponent implements OnInit {
  
  _user: User;
  empresas: Empresa[] = [];
  empresas_por_usuario: Empresa[];
  selected: number[];
  _userLoaded: Promise<boolean>;
  paramsSub: Subscription = Subscription.EMPTY;
  userSub: Subscription = Subscription.EMPTY;
  empresasSub: Subscription = Subscription.EMPTY;
  empresasUserSub: Subscription = Subscription.EMPTY;
  updateSub: Subscription = Subscription.EMPTY;
  
  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private eService: EmpresaService, private uService: UsuarioService, private storageService: StorageService,
    private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.getUser(params.get('id')).then(user_id => {
        this.getEmpresas().then(() => {
          this.getEmpresasByUser(user_id).then(() => {
            this.cargarForm();
          });
        });
      });
    });
  }

  getEmpresas() {
    var promise = new Promise<void>((resolve, reject) => {
      let rol_id = this.storageService.getCurrentUser().rol_id;
      if (rol_id == '1') {
        this.empresasSub = this.eService.getEmpresas().subscribe(data => {
          this.empresas = data;
          resolve();
        });
      } else if (rol_id == '2') {
        this.empresas = this.storageService.getCurrentEmpresas();
        resolve();
      }
    });
    return promise;
  }

  getUser(id) {
    var promise = new Promise<string>((resolve, reject) => {
      this.userSub = this.uService.getUser(id).subscribe(data => {
        this._user = data[0];
        resolve(this._user.id.toString());
        this._userLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }
  
  getEmpresasByUser(user_id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.empresasUserSub = this.eService.getEmpresasByUserId(user_id).subscribe(data => {
        this.empresas_por_usuario = data;
        this.selected = [];
        this.empresas_por_usuario.forEach(el => {
          let selectedId = this.empresas.find(emp => emp.id === el.id);
          if (selectedId != undefined) {
            this.selected.push(selectedId.id);
          }
        });
        resolve();
      });
    });
    return promise;
  }

  cargarForm() {
    this.form = this.fb.group({
      empresas: ['']
    });
    this.formCreated = Promise.resolve(true);
  }

  onSubmit() {
    console.log(this.form.valid);
    console.log(this.form.value);
    this.updateSub = this.eService.updateEmpresasByUserId(this._user.id.toString(), this.form.value.empresas).subscribe(
      data => {
        this._success = true;
        this._error = false;
        //this.form.reset();
      },
      error => {
        this._success = false;
        this._error = true;
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSub != Subscription.EMPTY) {this.paramsSub.unsubscribe()};
    if (this.userSub != Subscription.EMPTY) {this.userSub.unsubscribe()};
    if (this.empresasSub != Subscription.EMPTY) {this.empresasSub.unsubscribe()};
    if (this.empresasUserSub != Subscription.EMPTY) {this.empresasUserSub.unsubscribe()};
    if (this.updateSub != Subscription.EMPTY) {this.updateSub.unsubscribe()};
  }
}
