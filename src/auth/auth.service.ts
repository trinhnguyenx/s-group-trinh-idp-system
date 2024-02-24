import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });



@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private jwtService: JwtService,
	) {}
	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userService.findOneByUsername(username);
		if (user && bcrypt.compare(password, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}


  async login(user: User) {
    const payLoad = {
      username: user.username,
      sub: {
        fullname : user.fullname
      }
    };

    return {
      ...user,
      access_token: this.jwtService.sign(payLoad),
      refreshToken: this.jwtService.sign(payLoad, { expiresIn: '7d' }),

    }

  }
  async refreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: {
        fullname: user.fullname,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
