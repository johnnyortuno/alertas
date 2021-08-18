import { Component, OnInit } from '@angular/core';
import { Grupo } from '../core/models/grupo_principal.model';
import { Subscription } from 'rxjs';
import { GrupoService } from '../core/services/grupo.service';
import { RestServiceService } from '../core/services/rest-service.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';


import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({
  selector: 'app-alerta-lista',
  templateUrl: './alerta-lista.component.html',
  styleUrls: ['./alerta-lista.component.css']
})
export class AlertaListaComponent implements OnInit {

  formDetalle = new FormControl('');
  detalleform = new FormGroup({
    grupo: new FormControl('')
  });

  public pieChartOptions: ChartOptions = {
    responsive: false,
  };
  public pieChartLabels: Label[] = ['Vencidas', 'Ejecutadas', 'Por vencer'];
  public pieChartData: SingleDataSet = [0, 0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColor:any = [
    {
        backgroundColor: [
        'rgb(255,0,0)',
        'rgb(0, 102, 0)',
        'rgb(255, 255, 0)'
   
        
        ]
    }
];
// rgb(255, 0, 0) Rojo
//rgb(255, 255, 0) Amarillo
//rgb(0, 102, 0)
  constructor(private grService: GrupoService,
    private RestService: RestServiceService,
  ) { }
  _grupos: Grupo[];
  grupoSub: Subscription = Subscription.EMPTY;
  data: any;
  ejecutadas: any;
  vencidas: any;
  porvencerAmarillo: any;
  ngOnInit(): void {
    this.getGrupos();
    this.data = [];
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
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
  onSubmit() {

    console.log(this.detalleform.value);
    this.getData(this.detalleform.value.grupo);
    
  }


  getData(id: string) {

    var that = this;
    this.RestService.get(environment.serverUrl + "/alertas/" + id)
      .subscribe((resultado: any) => {
        console.log(resultado);
        const returnjson: any[] = Array.of(resultado);
        this.data = resultado;
        this.ejecutadas = 0;
        this.vencidas = 0;
        this.porvencerAmarillo = 0;
        this.data.forEach((item: any) => {
          this.porvencerAmarillo = this.porvencerAmarillo + item.porvencerAmarillo;
          this.vencidas = this.vencidas + item.vencidas;
          this.ejecutadas = this.ejecutadas + item.ejecutadas;
        })
        that.pieChartData= [that.vencidas , that.ejecutadas, that.porvencerAmarillo];
        // 'Vencidas', 'Ejecutadas', 'Por vencer']
      },
        error => {

        })


  }

}
