import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { CustomAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Author } from 'src/authorzation/entities/authorzation.entity';


@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		TypeOrmModule.forFeature([User, Role, Author]),
	],
	controllers: [UserController],
	providers: [
		UsersService,
		CustomAuthGuard,
	],
	exports: [UsersService],
})
export class UserModule {}
