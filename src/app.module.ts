import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeorm';

@Module({
	imports: [
		UserModule,
		RoleModule,
		PermissionModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [typeorm],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				configService.get('typeorm'),
		}),
		AuthModule,
	],
	controllers: [AppController, AuthController],
	providers: [AppService, AuthService],
})
export class AppModule {}
