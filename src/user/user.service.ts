import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { UserFilterDTO } from './dto/filter-user.dto';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) {}
	//CREATE
	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: createUserDto.email },
		});
		if (existingUser) {
			throw new NotFoundException('User already exists');
		}

		const user = new User();
		const salt = 10;
		user.email = createUserDto.email;
		user.username = createUserDto.username;
		user.password = await bcrypt.hash(createUserDto.password, salt);
		user.fullname = createUserDto.fullname;

		let defaultRole: Role | undefined;
		if (!createUserDto.role || createUserDto.role.length === 0) {
			defaultRole = await this.roleRepository.findOne({ where: { id: 2 } });
			if (!defaultRole) {
				throw new Error('Default role not found');
			}
		}

		const roles: Role[] = [];
		if (createUserDto.role && createUserDto.role.length > 0) {
			for (const roleId of createUserDto.role) {
				const role = await this.roleRepository.findOne({
					where: { id: roleId },
				});
				if (!role) {
					throw new Error(`Role with id ${roleId} not found`);
				}
				roles.push(role);
			}
		} else {
			roles.push(defaultRole!);
		}

		user.roles = roles;

		return this.userRepository.save(user);
	}

	async findAll(
		page: number = 1,
		limit: number = 20,
		search: string = '',
		sort: string = 'ASC',
	): Promise<User[]> {
		const offset = (page - 1) * limit;
		const conditions = {
			where: {
				email: Like(`%${search}%`),
				username: Like(`%${search}%`),
			},
			order: {
				email: sort.toUpperCase() as 'ASC' | 'DESC',
			},
			take: limit,
			skip: offset,
		};
		return await this.userRepository.find(conditions);
	}

	async findOneByemail(email: string): Promise<User | undefined> {
		return this.userRepository.findOne({
			where: { email: email },
			relations: ['roles'],
		});
	}

	async findOneByID(ID: any): Promise<User | undefined> {
		return this.userRepository.findOneBy({ id: ID });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findOne({
			where: { id },
		});
		if (!user) {
			throw new NotFoundException();
		}
		Object.assign(user, updateUserDto);

		return await this.userRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.userRepository.findOne({
			where: { id },
		});
		if (!user) {
			throw new NotFoundException();
		}
		return await this.userRepository.remove(user);
	}

	async updateRoles(id: number, roles: Role[]): Promise<User> {
		const user = await this.userRepository.findOneOrFail({ where: { id } });
		this.userRepository.merge(user, { roles });
		return await this.userRepository.save(user);
	}
	async getRightsByUserId(userId: number) {
		const user = await this.userRepository.findOne({
			relations: ['roles', 'roles.permissions'],
			where: {
				id: userId,
			},
		});

		if (!user) {
			throw new NotFoundException('Missing user');
		}

		return user.roles
			.map((role) => role.permissions.map((per) => per.name))
			.flat();
	}
	async seedUsers(): Promise<void> {
		const usersToCreate = 1000;
		for (let i = 0; i < usersToCreate; i++) {
		  const user: CreateUserDto = {
			username: `user_${i}`,
			fullname: `User ${i} Full Name`,
			password: `password`,
			email: `user${i}@example.com`,
			role: [4],
		  };
		  console.log(user);
		  await this.create(user);
		}
	}
	async getUsersWithFilter(filterDTO: UserFilterDTO): Promise<User[]> {
		const queryBuilder = this.userRepository.createQueryBuilder('user');
	
		if (filterDTO.username) {
			queryBuilder.andWhere('user.username LIKE :username', { username: `%${filterDTO.username}%` });
		}
	
		if (filterDTO.email) {
			queryBuilder.andWhere('user.email LIKE :email', { email: `%${filterDTO.email}%` });
		}
	
		return await queryBuilder.getMany();
	}
	
}
