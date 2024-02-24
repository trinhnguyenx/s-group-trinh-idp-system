import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from 'src/user/user.service';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: any) {
		return this.authService.login(req.user);
	}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.userService.create(createUserDto);
	}
	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	async refrshToken(@Request() req:any) {
		return this.authService.refreshToken(req.user);
	}
}
