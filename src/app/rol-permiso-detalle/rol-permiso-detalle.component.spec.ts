import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPermisoDetalleComponent } from './rol-permiso-detalle.component';

describe('RolPermisoDetalleComponent', () => {
  let component: RolPermisoDetalleComponent;
  let fixture: ComponentFixture<RolPermisoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolPermisoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolPermisoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
