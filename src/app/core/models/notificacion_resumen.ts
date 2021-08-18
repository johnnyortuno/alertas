export class Notificacion_resumen {
    public id: number;
    public nombre: string;
    public cantidad_realizada: number;
    public cantidad_no_realizada: number;
    public cantidad_por_vencer: number;
    public detalleResumen:Notificacion_resumen[];
}