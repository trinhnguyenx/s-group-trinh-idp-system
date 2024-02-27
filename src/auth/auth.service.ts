import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {Ilogin} from './interfaces/login.interface';
import { PermissionService } from 'src/permission/permission.service';




@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionService,

	) {}
	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userService.findOneByUsername(username);
		if (user && bcrypt.compare(password, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}


  async login(user: Ilogin) {
    const userF = await this.userService.findOneByUsername(user.username);
    if (!userF) {
      throw UnauthorizedException;
    }
    console.log(userF.roles);
		const userPermissions =
			await this.permissionsService.getPermissionByRolesName(
				userF.roles.map((role) => role.name),
			);
    const payLoad = {
      userID: userF.id,
      username: userF.username,
      sub: {
        fullname : userF.fullname
      },
      permissions: userPermissions,

    };

    return {
      ...userF,
      access_token: await this.jwtService.signAsync(payLoad, {secret: 'test',expiresIn: '1h'}),
      refreshToken: await this.jwtService.signAsync(payLoad, {secret: 'test',expiresIn: '7d'}),

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
      accessToken: await this.jwtService.signAsync(payload,{secret: 'test',expiresIn: '365d'}),
    };
  }
}
