import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { CustomAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';


@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		TypeOrmModule.forFeature([User, Role]),
		CacheModule.register({
			ttl: 5,
		
		}),
	],
	controllers: [UserController],
	providers: [
		UsersService,
		CustomAuthGuard,

		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
	exports: [UsersService],
})
export class UserModule {}
