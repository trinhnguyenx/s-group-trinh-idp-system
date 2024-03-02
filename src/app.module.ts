import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './user/user.service';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';
import typeorm from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';


@Module({
  imports: [
	  AuthModule,
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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
    }),
	TypeOrmModule.forFeature([User, Role, Permission]), 
  ],
  controllers: [AppController, AuthController],

  providers: [
    AppService,
    AuthService,
    UsersService,
    PermissionService,
    RoleService,
  ],
})
export class AppModule {}
