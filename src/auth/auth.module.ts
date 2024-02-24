import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/user/user.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
require("dotenv").config();
@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtService,LocalStrategy,UsersService,RefreshJwtStrategy,JwtStrategy,UsersService],
  imports : [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]), 
  ],
  exports: [AuthService, JwtService] 

})
export class AuthModule {}

