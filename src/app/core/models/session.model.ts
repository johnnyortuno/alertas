import { Empresa } from "./empresa.model";
import { Permiso } from "./permiso.model";
import { User } from "./user.model";

export class Session {
  public token: string;
  public user: User;
  public permisos?: Permiso[];
  public empresas?: Empresa[];
}