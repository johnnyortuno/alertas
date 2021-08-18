import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Nivel } from '../core/models/nivel.model';
import { NivelService } from '../core/services/nivel.service';

@Component({
  selector: 'app-nivel-lista',
  templateUrl: './nivel-lista.component.html',
  styleUrls: ['./nivel-lista.component.css']
})
export class NivelListaComponent implements OnInit {

  _niveles: Nivel[];
  nivelesSub: Subscription = Subscription.EMPTY;

  constructor(private nService: NivelService) { }

  ngOnInit(): void {
    this.getNiveles();
  }

  getNiveles() {
    this.nivelesSub = this.nService.getNiveles().subscribe(data => {
      this._niveles = data;
    });
  }

  ngOnDestroy() {
    if (this.nivelesSub != Subscription.EMPTY) {this.nivelesSub.unsubscribe()};
  }

}
