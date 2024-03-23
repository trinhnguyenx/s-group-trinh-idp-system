import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	SetMetadata,
	UseGuards,
	Query,
	UseInterceptors,
	Inject,
	Request,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomAuthGuard, Public } from '../auth/guards/jwt-auth.guard';
import { IUser } from 'src/auth/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}
	//Post
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	//Get
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Get()
	findAll(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('sort') sort: string,
	) {
		return this.userService.findAll(page, limit, search, sort);
	}
	// Get user/me
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin', 'user'])
	@Get('me')
	async findMe(@Request() req: any) {
		try {
			const token: string =
				(await req.headers.authorization.split(' ').length) == 2
					? req.headers.authorization.split(' ')[1]
					: req.headers.authorization;
			const decode: any = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET,
			});
			console.log(decode);
			const userId = decode.id;
			const user = await this.userService.findOneByID(userId);
			const { password, ...userWithoutPassword } = user;

			return userWithoutPassword;
		} catch (e) {
			return false;
		}
	}
	//Get from id
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Public()
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userService.findOneByID(id);
	}

	// Update
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}
	//Delete
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
	//
	// @Get(':userId/rights')
	// async getUserRights(@Param('userId') userId: number) {
	// 	const rights = await this.userService.getRightsByUserId(userId);
	// 	return { rights };
	// }
}
