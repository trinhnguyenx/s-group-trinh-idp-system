import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	SetMetadata,
	UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { CustomAuthGuard, Public } from '../auth/guards/jwt-auth.guard';


@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Post()
	create(@Body() createPermissionDto: Permission) {
		return this.permissionService.create(createPermissionDto);
	}
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Get()
	findAll() {
		return this.permissionService.findAll();
	}
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionService.findOne(+id);
	}
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePermissionDto: Permission) {
		return this.permissionService.update(+id, updatePermissionDto);
	}
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionService.remove(+id);
	}
	@UseGuards(CustomAuthGuard)
	@SetMetadata('roles', ['admin'])
	@Put('assignPermission')
	assignPermission(@Body() body: AssignPermissionDto) {
		return this.permissionService.assignPermission(
			body.roleID,
			body.permissionID,
		);
	}
}
