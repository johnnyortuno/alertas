import { Component, OnInit } from '@angular/core';
// import { RestServiceService } from '../rest-service.service';
import { RestServiceService } from '../core/services/rest-service.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ejecucion-lista',
  templateUrl: './ejecucion-lista.component.html',
  styleUrls: ['./ejecucion-lista.component.css']
})
export class EjecucionListaComponent implements OnInit {
  data: any;
  constructor(
    private router: Router,
    private RestService: RestServiceService
  ) { }

  ngOnInit(): void {
    this.getData();
  }


  getData() {

    var that = this;
    this.RestService.get(environment.serverUrl+ "/ejecuciones")
      .subscribe((resultado: any) => {
        console.log(resultado);
        const returnjson: any[] = Array.of(resultado);
        this.data = resultado;

      },
        error => {

        })

  }
  editar(ejecucion: any): void {
    //  this.router.navigateByUrl(['/ejecucion/' + ejecucion.id])
  }


}
