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
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomAuthGuard} from '../auth/guards/jwt-auth.guard';
@Controller('user')
export class UserController {
	constructor(private readonly userService: UsersService) {}
	//Post
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
	//Get
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin',"user"])
	@Get()
	findAll(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('sort') sort: string,
	) {
		return this.userService.findAll(page, limit, search, sort);
	}
	//Get from id
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
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
}
