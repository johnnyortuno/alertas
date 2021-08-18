import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Empresa } from '../core/models/empresa.model';
import { EmpresaService } from '../core/services/empresa.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.component.html',
  styleUrls: ['./empresa-lista.component.css']
})
export class EmpresaListaComponent implements OnInit {

  _empresas: Empresa[];
  empresasSub: Subscription = Subscription.EMPTY;

  constructor(private eService: EmpresaService, private storageService: StorageService) { }

  ngOnInit(): void {
    let rol_id = this.storageService.getCurrentUser().rol_id;
    if (rol_id == '1') {
      this.getEmpresas();
    } else if (rol_id == '2') {
      this._empresas = this.storageService.getCurrentEmpresas();
    }
  }

  getEmpresas() {
    this.empresasSub = this.eService.getEmpresas().subscribe(data => {
      this._empresas = data;
    });
  }

  ngOnDestroy() {
    if (this.empresasSub != Subscription.EMPTY) {this.empresasSub.unsubscribe()};
  }

}
