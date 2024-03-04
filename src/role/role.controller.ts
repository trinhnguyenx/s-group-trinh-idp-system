import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	UseGuards,
	SetMetadata,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CustomAuthGuard,Public } from '../auth/guards/jwt-auth.guard';


@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.create(createRoleDto);
	}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Get()
	findAll() {
		return this.roleService.findAll();
	}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(+id);
	}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.roleService.update(+id, updateRoleDto);
	}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.roleService.remove(+id);
	}
	@SetMetadata('permissions', ['super_admin permission', 'assign roles'])
	@Put('assignRole')
	assignRole(@Body() assignRoledto: AssignRoleDto) {
		return this.roleService.assignRole(
			assignRoledto.userID,
			assignRoledto.roleID,
		);
	}
}
