import { Module } from '@nestjs/common';
import { AuthorzationController } from './authorzation.controller';
import { AuthorzationService } from './authorzation.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Author } from './entities/authorzation.entity';
import { UsersService } from 'src/user/user.service';
import { Role } from 'src/role/entities/role.entity';

@Module({
	controllers: [AuthorzationController],
	providers: [AuthorzationService,UsersService],
	exports: [AuthorzationService],
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		TypeOrmModule.forFeature([User,Author,Role]),
	],
})
export class AuthorzationModule {}
