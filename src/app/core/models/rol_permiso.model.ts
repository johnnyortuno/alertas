import { Permiso } from "./permiso.model";
import { Rol } from "./rol.model";

export class Rol_permiso {
    public id: number;
    public rol: Rol;
    public permiso: Permiso;
    public activo: boolean;
}