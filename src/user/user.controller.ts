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
@Controller('user')
export class UserController {
	constructor(private readonly userService: UsersService) {}
	//@Public()
	@SetMetadata('permissions', ['create user'])
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
	// @UseGuards(PermissionGuard)
	// @SetMetadata('permissions', ['read user'])
	@Get()
	findAll(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('sort') sort: string,
	) {
		return this.userService.findAll(page, limit, search, sort);
	}
	@SetMetadata('permissions', ['read user'])
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userService.findOneByID(id);
	}
	@SetMetadata('permissions', ['update user'])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}
	@SetMetadata('permissions', ['delete user'])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
