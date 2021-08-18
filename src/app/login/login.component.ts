import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { Permiso } from '../core/models/permiso.model';
import { Session } from '../core/models/session.model';
import { EmpresaService } from '../core/services/empresa.service';
import { EncryptDecryptService } from '../core/services/encrypt-decrypt.service';
import { PermisoService } from '../core/services/permiso.service';
import { StorageService } from '../core/services/storage.service';
import { AuthenticationService } from './shared/authentication.service';
import { LoginObject } from './shared/login-object.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  formCreated: Promise<boolean>;
  error: {code: number, message: string} = null;
  permisosSub: Subscription = Subscription.EMPTY;
  authSub: Subscription = Subscription.EMPTY;
  empresasSub: Subscription = Subscription.EMPTY;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router, 
    private storageService: StorageService, private encryptDecryptService: EncryptDecryptService, 
    private pService: PermisoService, private eService: EmpresaService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.formCreated = Promise.resolve(true);
    document.body.classList.add('hundred');
  }

  onSubmit() {
    const val = this.form.value;
    let loginObj: LoginObject;

    if (val.email && val.password) {
      this.encryptDecryptService.set(this.encryptDecryptService.getPassKey(), val.password).then(
        encryptedPassword => {
          loginObj = {
            username: val.email,
            password: encryptedPassword

          };
          
          
         
          this.authSub = this.authService.login(loginObj).subscribe(
            data => {
              console.log(data);
              let session: Session = {
                user: data.user,
                token: data.accessToken
              }
              this.correctLogin(session);
              //this.router.navigateByUrl('/');
            },
            error => {
              console.log("Error");
              this.error = JSON.parse(error._body)
            }
          );
        }
      );
    }
  }

  private correctLogin(data: Session){
    this.getPermisos(data.user.rol_id).then(permisos => {
      data.permisos = permisos;
      console.log("Permisos",data.permisos);
      this.getEmpresas(data.user.id).then(empresas => {
        data.empresas = empresas;
        this.storageService.setCurrentSession(data);
        this.router.navigateByUrl('/');
      });
    });
  }

  private getPermisos(rol_id: string) {
    var promise = new Promise<Permiso[]>((resolve, reject) => {
      this.permisosSub = this.pService.getPermisosByRol(rol_id).subscribe(
        permisos => {
          resolve(permisos);
        }
      );
    });
    return promise;
  }

  private getEmpresas(user_id) {
    var promise = new Promise<Empresa[]>((resolve, reject) => {
      this.empresasSub = this.eService.getEmpresasByUserId(user_id).subscribe(
        empresas => {
          resolve(empresas);
        }
      );
    });
    return promise;
  }

  ngOnDestroy() {
    if (this.permisosSub != Subscription.EMPTY) {this.permisosSub.unsubscribe()};
    if (this.authSub != Subscription.EMPTY) {this.authSub.unsubscribe()};
    if (this.empresasSub != Subscription.EMPTY) {this.empresasSub.unsubscribe()};
  }

}
