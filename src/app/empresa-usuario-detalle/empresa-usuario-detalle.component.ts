import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { User } from '../core/models/user.model';
import { EmpresaService } from '../core/services/empresa.service';
import { StorageService } from '../core/services/storage.service';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-empresa-usuario-detalle',
  templateUrl: './empresa-usuario-detalle.component.html',
  styleUrls: ['./empresa-usuario-detalle.component.css']
})
export class EmpresaUsuarioDetalleComponent implements OnInit {

  _empresa: Empresa;
  usuarios: User[] = [];
  usuarios_por_empresa: User[];
  selected: number[];
  _empresaLoaded: Promise<boolean>;
  paramsSub: Subscription = Subscription.EMPTY;
  empresaSub: Subscription = Subscription.EMPTY;
  usersSub: Subscription = Subscription.EMPTY;
  usersEmpresaSub: Subscription = Subscription.EMPTY;
  updateSub: Subscription = Subscription.EMPTY;
  
  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;

  constructor(private eService: EmpresaService, private uService: UsuarioService, private storageService: StorageService, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.getEmpresa(params.get('id')).then(empresa => {
        this.getUsuarios().then(() => {
          this.getUsersByEmpresa(empresa).then(() => {
            this.cargarForm();
          });
        });
      });
    });
  }

  getUsuarios() {
    var promise = new Promise<void>((resolve, reject) => {
      let rol_id = this.storageService.getCurrentUser().rol_id;
      if (rol_id == '1') {
        this.usersSub = this.uService.getUsers().subscribe(data => {
          this.usuarios = data;
          resolve();
        });
      } else if (rol_id == '2') {
        let empresas = this.storageService.getCurrentEmpresas();
        this.usersSub = this.uService.getUsersByEmpresas(empresas).subscribe(data => {
          this.usuarios = data;
          resolve();
        });
      }
    });
    return promise;
  }

  getEmpresa(id) {
    var promise = new Promise<Empresa>((resolve, reject) => {
      this.empresaSub = this.eService.getEmpresa(id).subscribe(data => {
        this._empresa = data[0];
        resolve(this._empresa);
        this._empresaLoaded = Promise.resolve(true);
      });
    });
    return promise;
  }
  
  getUsersByEmpresa(empresa: Empresa) {
    var promise = new Promise<void>((resolve, reject) => {
      let empresas: Empresa[] = [];
      empresas.push(empresa);
      this.usersEmpresaSub = this.uService.getUsersByEmpresas(empresas).subscribe(data => {
        this.usuarios_por_empresa = data;
        this.selected = [];
        this.usuarios_por_empresa.forEach(el => {
          this.selected.push(this.usuarios.find(us => us.id === el.id).id);
        });
        resolve();
      });
    });
    return promise;
  }

  cargarForm() {
    this.form = this.fb.group({
      usuarios: ['']
    });
    this.formCreated = Promise.resolve(true);
  }

  onSubmit() {
    console.log(this.form.valid);
    console.log(this.form.value);
    this.updateSub = this.uService.updateUsersByEmpresaId(this._empresa.id.toString(), this.form.value.usuarios).subscribe(
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
    if (this.empresaSub != Subscription.EMPTY) {this.empresaSub.unsubscribe()};
    if (this.usersSub != Subscription.EMPTY) {this.usersSub.unsubscribe()};
    if (this.usersEmpresaSub != Subscription.EMPTY) {this.usersEmpresaSub.unsubscribe()};
    if (this.updateSub != Subscription.EMPTY) {this.updateSub.unsubscribe()};
  }

}
