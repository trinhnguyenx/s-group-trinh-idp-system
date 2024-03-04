import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) {}
	async create(createUserDto: CreateUserDto) {
		if (
			await this.userRepository.findOne({
				where: { username: createUserDto.username },
			})
		) {
			throw new NotFoundException('User already exists');
		}
		
		const user = new User();
		const salt = 10;
		user.username = createUserDto.username;
		user.password = await bcrypt.hash(createUserDto.password, salt);
		user.fullname = createUserDto.fullname;
		const savedUser = await this.userRepository.create(user);
		if (!Array.isArray(createUserDto.role) || createUserDto.role.length === 0) {
			throw new Error('Invalid or empty role data');
		}
		const roles: Role[] = [];
		for (const roleId of createUserDto.role) {
			const role = await this.roleRepository.findOneBy({ id: roleId });
			if (!role) {
				throw new Error(`Role with id ${roleId} not found`);
			}
			roles.push(role);
		}
		savedUser.roles = roles;
		return this.userRepository.save(savedUser);
	}

	async findAll(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		sort: string = 'ASC',
	): Promise<User[]> {
		// Tính toán offset dựa trên trang và giới hạn
		const offset = (page - 1) * limit;

		// Tạo một đối tượng chứa các điều kiện tìm kiếm và sắp xếp
		const conditions = {
			// Điều kiện tìm kiếm dựa trên search (ví dụ: tên người dùng)
			where: {
				username: Like(`%${search}%`),
			},
			// Sắp xếp theo username
			order: {
				username: sort.toUpperCase() as 'ASC' | 'DESC',
			},
			// Giới hạn số lượng kết quả trả về
			take: limit,
			// Bỏ qua kết quả trước offset
			skip: offset,
		};

		// Sử dụng repository để tìm kiếm người dùng dựa trên điều kiện và trả về kết quả
		return await this.userRepository.find(conditions);
	}

	async findOneByUsername(username: string): Promise<User | undefined> {
		return this.userRepository.findOne({
			where: { username: username },
			relations: ['roles'],
		});
	}

	async findOneByID(ID: number): Promise<User | undefined> {
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
}
