import {
	Controller,
	Post,
	Request,
	UseGuards,
	Body,
	Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from 'src/user/user.service';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { SetMetadata } from '@nestjs/common';
import { CustomAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './guards/jwt-auth.guard';
import { Ilogin } from './interfaces/login.interface';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}
	@Public()
	@Post('login')
	async login(@Body() req: Ilogin){
		return this.authService.login(req);
	}
	@Public()
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.userService.create(createUserDto);
	}
	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	async refreshToken(@Request() req: any) {
		return this.authService.refreshToken(
			req.headers.authorization.split(' ')[1],
		);
	}
}
