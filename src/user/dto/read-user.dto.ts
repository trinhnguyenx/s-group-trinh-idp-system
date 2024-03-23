import { Role } from 'src/role/entities/role.entity';

export class ReadUserDto {
	id: number;
	email: string;
	username: string;
	fullname: string;
	createdAt: Date;
	updatedAt: Date;
	roles: Role[];
}
