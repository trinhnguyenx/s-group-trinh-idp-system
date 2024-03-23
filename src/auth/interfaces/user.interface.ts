export interface IUser {
    id: number;
    email: string;
    username: string;
    password: string;
    fullname: string;
    roles: IRoles[];
  }
export interface IRoles { 
    id: number;
    name: string;
    description: string;
}