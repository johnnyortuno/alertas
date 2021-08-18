export class User {
    public id: number;
    public name: string;
    public surname: string;
    public email: string;
    public username: string;
    public password?: string;
    public rol_id: string;
    public rol_name: string;
    public activo: boolean;
    public fecha_creacion?: Date;
}