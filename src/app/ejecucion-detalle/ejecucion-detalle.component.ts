import { Component, OnInit } from '@angular/core';
import { Grupo } from '../core/models/grupo_principal.model';
import { GrupoService } from '../core/services/grupo.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RestServiceService } from '../core/services/rest-service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ejecucion-detalle',
  templateUrl: './ejecucion-detalle.component.html',
  styleUrls: ['./ejecucion-detalle.component.css']
})
export class EjecucionDetalleComponent implements OnInit {
  _grupos: Grupo[];
  id = '';
  grupoSub: Subscription = Subscription.EMPTY;
  constructor(private grService: GrupoService,
    private route: ActivatedRoute,
    private RestService: RestServiceService,
    private router: Router) { }
  formDetalle = new FormControl('');
  detalleform = new FormGroup({
    id: new FormControl(''),
    mensaje: new FormControl(''),
    estado: new FormControl(''),
    familia: new FormControl(''),
    grupo : new FormControl(''),
    fecha : new FormControl('')
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) => {
      const { params } = paramMap
      this.id = String(params.id);
      this.detalleform.patchValue({
        id: params.id
      });
      this.cargarData(this.detalleform.value.id);
    });
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

  cargarData(id: number): void {
    this.RestService.get(environment.serverUrl + "/ejecuciones/" + id)
      .subscribe((data: any) => {
        const returnjson: any[] = Array.of(data);
        this.detalleform.patchValue({
          mensaje: data[0].mensaje,
          estado: data[0].estado,
          familia: data[0].familia,
          grupo: data[0].grupo,
          fecha: data[0].fecha
        });

      },
        error => {
        })
  }
  onSubmit(){
    this.RestService.put(environment.serverUrl + "/ejecuciones/" + this.detalleform.value.id, JSON.stringify(this.detalleform.value))
      .subscribe((res: any) => {
        alert('Modificacion exitosa');
         this.router.navigate(['/ejecuciones'])
      }, err => {
        console.log(err);
      })

  }

}
