export class Notificacion {
    public id: number;
    public mensaje: string;
    public nivel_id: string;
    public creador_id: string;
    public fecha_creacion?: Date;
    public activo: boolean;
    public user_name?: string;
    public user_surname?: string;
    public empresas: number[];
    public id_grupo: number;
    public id_familia: number;
    public id_periodo: number;
    public fecha_ejecucion: string;
}