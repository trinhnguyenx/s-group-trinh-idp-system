import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/user/user.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { APP_GUARD } from '@nestjs/core';
import { CustomAuthGuard } from './guards/jwt-auth.guard';
@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		LocalStrategy,
		JwtStrategy,
		RefreshJwtStrategy,
		UsersService,
		JwtService,
		PermissionService,
		RoleService,
		{
			provide: APP_GUARD,
			useClass: CustomAuthGuard,
		},
	],
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		TypeOrmModule.forFeature([User,Permission,Role]),

	],
})
export class AuthModule {}
