import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Grupo } from "../core/models/grupo_principal.model";
import { GrupoService } from "../core/services/grupo.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamiliaService } from "../core/services/familia.service";
import { PeriocidadService } from "../core/services/periocidad.service";
import { ActivatedRoute } from "@angular/router";
import { NotificacionService } from "../core/services/notificacion.service";
import { EmpresaService } from "../core/services/empresa.service";
import { NivelService } from "../core/services/nivel.service";
import { StorageService } from "../core/services/storage.service";
import { Notificacion_resumen } from "../core/models/notificacion_resumen";


declare var $:any;

@Component({
    selector: 'app-notificacion-resumen',
    templateUrl: './notificacion-resumen.component.html',
    styleUrls: ['./notificacion-resumen.component.css']
  })
  export class NotificacionResumenComponent implements OnInit {

    grupoSub: Subscription = Subscription.EMPTY;
    _grupos: Grupo[];
    _familiaResumen: Notificacion_resumen[];
    paramsSub: Subscription = Subscription.EMPTY;
    familiaResumen:Notificacion_resumen;
    
    _bandTBDetalle:boolean =false;


    ngOnInit(): void {
        this._familiaResumen= [{
            "id":1,"nombre":"jose", "cantidad_realizada":0,
            "cantidad_no_realizada": 0,
            "cantidad_por_vencer": 0,
            detalleResumen:null
        }];
        this.paramsSub = this.route.paramMap.subscribe(params => {
        this.getGrupos();

        
        console.log("Resumen", this._familiaResumen);

        });
    }




    constructor(private route: ActivatedRoute, private nService: NotificacionService, private eService: EmpresaService, private niService: NivelService, private fb: FormBuilder, private storageService: StorageService,private grService: GrupoService,private fmService: FamiliaService,private perService:PeriocidadService) { }

    changeGrupoSelectedItem(filterVal: any) {
        console.log(filterVal);
        //this.getFamilia(filterVal);
      }

      getGrupos() {
        
        var promise = new Promise<void>((resolve, reject) => {
          this.grupoSub = this.grService.getGrupos().subscribe(data => {
            this._grupos = data;
            console.log(this._grupos);
            resolve();
          });
        });
        return promise;
      }
    

      getItemDetalle(fila:String){
        this._bandTBDetalle = this._bandTBDetalle == true ? false:true;
    
        
    
        if ($(".class-show-elm-aud-1-"+(fila)).hasClass("show-elm")) {
          $(".class-show-elm-aud-1-"+(fila)).removeClass("show-elm");
          $(".class-show-elm-aud-1-"+(fila)).addClass("notshow-elm");
        }    
        else{
          $(".class-show-elm-aud-1-"+(fila)).removeClass("notshow-elm");
          $(".class-show-elm-aud-1-"+(fila)).addClass("show-elm");
        }
    
    
    
      }
    }

    