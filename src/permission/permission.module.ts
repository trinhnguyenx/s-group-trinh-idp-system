import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { CustomAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {JwtService} from '@nestjs/jwt';


@Module({
	imports: [
		RoleModule,
		UserModule,
		TypeOrmModule.forFeature([Permission, Role, User]),
	],
	controllers: [PermissionController],
	providers: [PermissionService, RoleService, CustomAuthGuard, JwtService],
})
export class PermissionModule {}
