import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Rol } from '../core/models/rol.model';
import { User } from '../core/models/user.model';
import { RolService } from '../core/services/rol.service';
import { UsuarioService } from '../core/services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EncryptDecryptService } from '../core/services/encrypt-decrypt.service';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {

  user_id: any = null;
  _user: User;
  _userLoaded: Promise<boolean>;
  _new: boolean;
  _roles: Rol[];
  userSub: Subscription = Subscription.EMPTY;
  rolSub: Subscription = Subscription.EMPTY;
  paramsSub: Subscription = Subscription.EMPTY;
  newUserSub: Subscription = Subscription.EMPTY;

  form: FormGroup;
  formCreated: Promise<boolean>;
  _success: boolean = false;
  _error: boolean = false;
  _invalid: boolean = false;
  
  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService, private rolService: RolService, private fb: FormBuilder, private encryptDecryptService: EncryptDecryptService) { }

  ngOnInit(): void {
    this.getRoles();
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.user_id = params.get('id');
      if (this.user_id != null) {
        this._new = false;
        this.getUser(this.user_id).then(() => {
          this.cargarForm();
          this._userLoaded = Promise.resolve(true);
        });
      } else {
        this._new = true;
        this.crearForm();
        this._userLoaded = Promise.resolve(true);
      }
    });
  }

  getRoles() {
    this.rolSub = this.rolService.getRoles().subscribe(data => {
      this._roles = data;
    });
  }

  getUser(id) {
    var promise = new Promise<void>((resolve, reject) => {
      this.userSub = this.usuarioService.getUser(id).subscribe(data => {
        this._user = data[0];
        resolve();
      });
    });
    return promise;
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol_id: [1],
      username: ['', Validators.required],
      passwords: this.fb.group({
        password: ['', Validators.required],
        password2: ['', Validators.required]
      }),
      activo: [true]
    });
    this.formCreated = Promise.resolve(true);
  }

  cargarForm() {
    this.form = this.fb.group({
      id: [this._user.id, Validators.required],
      name: [this._user.name, Validators.required],
      surname: [this._user.surname, Validators.required],
      email: [this._user.email, [Validators.required, Validators.email]],
      rol_id: [this._user.rol_id, Validators.required],
      username: [this._user.username, Validators.required],
      activo: [this._user.activo]
    });
    this.formCreated = Promise.resolve(true);
  }

  get name() { return this.form.get('name'); }
  get surname() { return this.form.get('surname'); }
  get email() { return this.form.get('email'); }
  get username() { return this.form.get('username'); }
  get password() { return this.form.get(['passwords','password']); }
  get password2() { return this.form.get(['passwords','password2']); }

  onSubmit() {
    let new_user: User;
    if (this._new) {
      if (this.form.valid) {
        this.encryptDecryptService.set(this.encryptDecryptService.getPassKey(), this.form.value.passwords.password).then(
          encryptedPassword => {
            new_user = {
              id: 0,
              name: this.form.value.name,
              surname: this.form.value.surname,
              email: this.form.value.email,
              username: this.form.value.username,
              password: encryptedPassword,
              rol_id: this.form.value.rol_id,
              rol_name: '',
              activo: this.form.value.activo,
              fecha_creacion: null
            };
            this._invalid = false;
        
            this.newUserSub = this.usuarioService.newUser(new_user).subscribe(
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
          }
        );
      } else {
        this._invalid = true;
      }

    } else {
      
      if (this.form.valid) {
        
        new_user = {
          id: this._user.id != null ? this._user.id : this.form.value.id,
          name: this.form.value.name,
          surname: this.form.value.surname,
          email: this.form.value.email,
          username: this.form.value.username,
          password: '',
          rol_id: this.form.value.rol_id,
          rol_name: '',
          activo: this.form.value.activo,
          fecha_creacion: null
        };
        this._invalid = false;
    
        this.newUserSub = this.usuarioService.updateUser(new_user).subscribe(
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
    if (this.userSub != Subscription.EMPTY) {this.userSub.unsubscribe()};
    if (this.rolSub != Subscription.EMPTY) {this.rolSub.unsubscribe()};
    if (this.newUserSub != Subscription.EMPTY) {this.newUserSub.unsubscribe()};
  }

}
